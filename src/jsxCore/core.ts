import { deepEqual } from '@/utils/deepEqual';
import { _setUpdatedInstance, _unsetUpdatedInstance } from './hooks';
import {
  IComponentElement,
  IComponentFunction,
  NormalizedChildren,
} from './types';
import { markDirty, scheduleUpdate } from './updateQueue';

// Тип нужен для хранения информации о существующих DOM-узлах, связанных именно с этим инстансом
// и не имеющих отношения к под-инстансам
type DOMNodeRepr = Node | { elem: Element; children: DOMNodeRepr[] };

export class ComponentInstance<PropsType = any> {
  func: IComponentFunction;
  depth: number;
  props: any;
  state: any[] = [];
  componentName: string = 'Unknown';
  private instanceMap: Map<string, ComponentInstance<PropsType>> = new Map(); // Карта для хранения инстансов
  vTree: NormalizedChildren = [];
  parent?: ComponentInstance<any>;
  domNodes: DOMNodeRepr[] = []; // Только те DOM-узлы, которые принадлежат этому компоненту; узлы подкомпонентов не включаются
  constructor(
    func: IComponentFunction<PropsType>,
    parent: ComponentInstance<any> | undefined,
    props: any = new Map()
  ) {
    this.parent = parent;
    this.depth = parent !== undefined ? parent.depth + 1 : 0;
    this.func = func;
    this.props = props;
    this.create();
  }
  /**
   * Получить список узлов верхнего уровня (в список включены узлы, созданные подкомпонентами)
   */
  getMountNodes(): Node[] {
    console.log('-----');
    console.log('func', this.func);
    console.log('vTree', this.vTree);
    console.log('domNodes', this.domNodes);
    console.log('-----');
    const ret: Node[] = [];
    let i: number = 0;
    this.vTree.forEach((vNode) => {
      if (typeof vNode === 'string' || vNode.elementType === 'JSXElement') {
        if (i >= this.domNodes.length) {
          throw new RangeError('vTree and domNodes are not aligned');
        }
        const nodeRepr = this.domNodes[i];
        if (nodeRepr instanceof Node) {
          ret.push(nodeRepr);
        } else {
          ret.push(nodeRepr.elem);
        }
        i++;
      } else {
        // ComponentElement
        const instance = this.instanceMap.get(vNode.key);
        if (instance === undefined) {
          throw new Error(
            `No matching instance in instanceMap with key='${vNode.key}'`
          );
        }
        ret.push(...instance.getMountNodes());
      }
    });
    return ret;
  }
  private updateVTree() {
    _setUpdatedInstance(this);
    const [componentName, newVTree] = this.func(this.props);
    this.componentName = componentName;
    console.log(componentName, newVTree);
    _unsetUpdatedInstance();
    this.vTree = newVTree;
  }

  /** Построить vTree, создать инстансы подкомпонентов и создать DOM-узлы */
  private create() {
    // Построить vTree
    this.updateVTree();
    // Создать инстансы подкомпонентов
    this.createComponentInstances();
    // Создать DOM-узлы
    this.createDomNodes();
  }
  private createComponentInstances() {
    this.createComponentInstances_impl(this.vTree);
  }
  private createComponentInstances_impl(vSubtree: NormalizedChildren) {
    vSubtree.forEach((vNode) => {
      if (typeof vNode !== `string`) {
        if (vNode.elementType === 'ComponentElement') {
          if (this.instanceMap.has(vNode.key)) {
            throw new Error(`Duplicating key: '${vNode.key}'`);
          }
          const newInstance = new ComponentInstance(
            vNode.func,
            this,
            vNode.props
          );
          this.instanceMap.set(vNode.key, newInstance);
        } else {
          this.createComponentInstances_impl(vNode.children);
        }
      }
    });
  }
  /**
   * Создать DOM-узлы, соответствующие vTree (для нового Instance компонента)
   */
  private createDomNodes() {
    const newDomNodes: DOMNodeRepr[] = [];
    this.vTree.forEach((vNode) => {
      if (typeof vNode === 'string') {
        newDomNodes.push(document.createTextNode(vNode));
      } else if (vNode.elementType === 'JSXElement') {
        const newElement = document.createElement(vNode.tagName);
        vNode.props.forEach((value, key) => {
          newElement.setAttribute(key, value);
        });
        const newEntry: { elem: Element; children: DOMNodeRepr[] } = {
          elem: newElement,
          children: [],
        };
        this.createDomNodes_impl(newElement, vNode.children, newEntry.children);
        newDomNodes.push(newEntry);
      } else {
        // В инстансе не хранятся узлы, созданные под-инстансом
      }
    });
    console.log(newDomNodes);
    this.domNodes = newDomNodes;
  }
  private createDomNodes_impl(
    parent: Element,
    vTree: NormalizedChildren,
    arrayToPush: DOMNodeRepr[]
  ): void {
    const newChildren: Node[] = [];
    vTree.forEach((vNode) => {
      if (typeof vNode === 'string') {
        const newNode = document.createTextNode(vNode);
        arrayToPush.push(newNode);
        newChildren.push(newNode);
      } else if (vNode.elementType === 'ComponentElement') {
        const instance = this.instanceMap.get(vNode.key);
        if (instance === undefined) {
          throw new Error(`Instance with key ${vNode.key} was not created`);
        } else {
          newChildren.push(...instance.getMountNodes());
        }
      } else if (vNode.elementType === 'JSXElement') {
        const newElement = document.createElement(vNode.tagName);
        const newEntry: { elem: Element; children: DOMNodeRepr[] } = {
          elem: newElement,
          children: [],
        };
        vNode.props.forEach((value, key) => {
          newElement.setAttribute(key, value);
        });
        this.createDomNodes_impl(newElement, vNode.children, newEntry.children);
        arrayToPush.push(newEntry);
        newChildren.push(newElement);
      }
    });
    parent.replaceChildren(...newChildren);
  }

  update() {
    // Обновить vTree
    this.updateVTree();
    // Обновить под-инстансы и удалить неактуальные
    this.patchInstances();
    // Пропатчить DOM
  }
  private patchInstances() {
    // Получить список всех элементов из нового vTree
    const allElements = new Map<string, IComponentElement>();
    this.getElementsFromVTree(this.vTree, allElements);

    // Удалить неактуальные под-инстансы
    const allKeys = new Set<string>();
    const existingKeys = new Set<string>(this.instanceMap.keys());
    const keysToDestroy: string[] = [];
    existingKeys.forEach((key) => {
      if (!allKeys.has(key)) {
        keysToDestroy.push(key);
      }
    });
    keysToDestroy.forEach((key) => {
      const instance = this.instanceMap.get(key);
      if (instance !== undefined) {
        instance.destroy();
      }
      this.instanceMap.delete(key);
    });
    keysToDestroy.splice(0, keysToDestroy.length);
    // Сравнить старые под-инстансы: если изменилась функция - удалить (а потом заменить на новый), если не изменилась - обновить
    this.instanceMap.forEach((oldInstance, key) => {
      const newElement = allElements.get(key);
      if (newElement !== undefined) {
        if (newElement.func !== oldInstance.func) {
          keysToDestroy.push(key);
        } else {
          const oldProps = oldInstance.props;
          const newProps = newElement.props;
          if (!deepEqual(oldProps, newProps)) {
            oldInstance.props = newProps;
            markDirty(oldInstance);
            scheduleUpdate();
          }
        }
      }
    });
    keysToDestroy.forEach((key: string) => {
      const instance = this.instanceMap.get(key);
      if (instance !== undefined) {
        instance.destroy();
      }
      this.instanceMap.delete(key);
    });
    // Добавить новые под-инстансы
    allElements.forEach((newElement, key) => {
      if (!this.instanceMap.has(key)) {
        const newInstance = new ComponentInstance(
          newElement.func,
          this,
          newElement.props
        );
        this.instanceMap.set(key, newInstance);
      }
    });
  }
  /**
   * Рекурсивно извлечь все IComponentElement из данного поддерева
   * @param vSubtree Поддерево, из которого надо извлекать IComponentElement
   * @param allElements Мапа, в которую будут помещены найденные IComponentElement
   */
  private getElementsFromVTree(
    vSubtree: NormalizedChildren,
    allElements: Map<string, IComponentElement>
  ) {
    vSubtree.forEach((vNode) => {
      if (typeof vNode !== 'string') {
        if (vNode.elementType === 'JSXElement') {
          this.getElementsFromVTree(vNode.children, allElements);
        } else {
          if (allElements.has(vNode.key)) {
            throw new Error(`Duplicating key: ${vNode.key}`);
          }
          allElements.set(vNode.key, vNode);
        }
      }
    });
  }
  private patchDomNodes() {
    this.patchDomNodes_impl(this.domNodes, this.vTree);
  }
  private patchDomNodes_impl(nodes: DOMNodeRepr[], vTr: NormalizedChildren) {
    let domIndex = 0;
    let vIndex = 0;
    while (domIndex < nodes.length && vIndex < vTr.length) {
      let domNode = nodes[domIndex];
      const vNode = vTr[vIndex];
      if (vNode === undefined) {
        vIndex++;
        continue;
      }
      if (domNode instanceof Element && typeof vNode === 'string') {
        domNode = document.createTextNode(vNode);
        if (domNode.parentNode !== null) {
          domNode.parentNode.replaceChild(domNode, domNode);
        }
        nodes.splice(domIndex, 1, domNode);
        domIndex++;
        vIndex++;
      } else if (domNode instanceof Node && typeof vNode === 'object') {
        //const newElement=document.createElement()
      }
    }
  }

  destroy() {
    // Просто удалить себя из DOM-дерева
    this.getMountNodes().forEach((node) => {
      node.parentElement?.removeChild(node);
    });
  }
}

let mainFunc: IComponentFunction | undefined = undefined;

export function createApp(func: IComponentFunction, mountTo: Element) {
  mainFunc = func;
  const mainInstance = new ComponentInstance(mainFunc, undefined, new Map());
  mountTo.replaceChildren(...mainInstance.getMountNodes());
}
