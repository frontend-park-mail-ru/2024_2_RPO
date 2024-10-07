import { _setUpdatedInstance, _unsetUpdatedInstance } from './hooks';
import { IComponentFunction, NormalizedChildren } from './types/elementTypes';

export class ComponentInstance {
  func: IComponentFunction;
  depth: number;
  props: object = {};
  state: any[] = [];
  private instanceMap: Map<string, ComponentInstance> = new Map(); // Карта для хранения инстансов
  vTree: NormalizedChildren = [];
  parent?: ComponentInstance;
  domNodes: Node[] = []; // Только те DOM-узлы, которые принадлежат этому компоненту; узлы подкомпонентов не включаются
  constructor(
    func: IComponentFunction,
    parent: ComponentInstance | undefined,
    props: object
  ) {
    this.parent = parent;
    this.depth = parent !== undefined ? parent.depth + 1 : 0;
    this.func = func;
    this.props = props;
  }
  /**
   * Получить список узлов верхнего уровня (в список включены узлы, созданные подкомпонентами)
   */
  getMountNodes(): Node[] {
    const ret: Node[] = [];
    let i: number = 0;
    this.vTree.forEach((vNode) => {
      if (vNode instanceof ComponentInstance) {
        vNode.getMountNodes().forEach((node) => {
          ret.push(node);
        });
      } else {
        ret.push(this.domNodes[i]);
        i++;
      }
    });
    return ret;
  }
  /**
   * Создать DOM-узлы, соответствующие vTree (для нового Instance компонента)
   */
  private createDomNodes() {}
  private createChildDomNodes(
    parent: Element,
    vTree: NormalizedChildren
  ): void {
    const newChildren: Node[] = [];
    vTree.forEach((vNode) => {
      if (typeof vNode === 'string') {
        newChildren.push(document.createTextNode(vNode));
      } else if (vNode.elementType === 'ComponentElement') {
        const instance = this.instanceMap.get(vNode.key);
        if (instance === undefined) {
          throw new Error(`Instance with key ${vNode.key} was not created`);
        } else {
          newChildren.push(...instance.getMountNodes());
        }
      } else if (vNode.elementType === 'JSXElement') {
        const newElement = document.createElement(vNode.tagName);
        // Передаём аттрибуты

        // Рекурсивно продолжаем создание
        newChildren.push(newElement);
      }
    });
    parent.replaceChildren(...newChildren);
  }
  private updateVTree() {
    _setUpdatedInstance(this);
    const newVTree = this.func(this.props);
    _unsetUpdatedInstance();
    this.vTree = newVTree;
  }
  private patchDomNodes() {
    this.patchDomNodes_impl(this.domNodes, this.vTree);
  }
  private patchDomNodes_impl(nodes: Node[], vTr: NormalizedChildren) {
    let domIndex = 0;
    let vIndex = 0;
    //TODO очистить nodes от всего, что связано с подкомпонентами
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
      } else if (
        domNode.nodeType === domNode.TEXT_NODE &&
        typeof vNode === 'object'
      ) {
        //const newElement=document.createElement()
      }
    }
  }
}

let mainFunc: IComponentFunction | undefined = undefined;

export function createApp(func: IComponentFunction, mountTo: Element) {
  mainFunc = func;
  const mainInstance = new ComponentInstance(mainFunc, undefined, {});
  mainInstance.create();
  mountTo.replaceChildren(...mainInstance.getMountNodes());
}
