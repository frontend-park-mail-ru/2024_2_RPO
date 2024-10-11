import { deepEqual } from '@/utils/deepEqual';
import { _setUpdatedInstance, _unsetUpdatedInstance } from './hooks';
import {
  JsxComponentElement,
  IComponentFunction,
  JsxSubtree,
  ComponentProps,
  JsxHtmlElement,
  JsxTextNode,
} from './types';
import { markDirty, scheduleUpdate } from './updateQueue';

// Тип нужен для хранения информации о существующих DOM-узлах, связанных именно с этим инстансом
// и не имеющих отношения к под-инстансам
interface DOMElementRepr {
  nodeType: 'Element';
  node: Element;
  children: DOMNodeRepr[];
  eventListeners: {
    type: string;
    listener: EventListener;
  }[];
  existingAttrs: Map<string, string>;
}
interface DOMTextNodeRepr {
  nodeType: 'TextNode';
  node: Node;
}
type DOMNodeRepr = DOMTextNodeRepr | DOMElementRepr;

/**
 * Пропатчить элементу пропсы. Удалить неактуальные атрибуты. Заменить ранее назначенные обработчики событий
 * @param props Пропсы
 * @param elem Элемент, который будем менять
 */
function patchProps(props: any, elem: DOMElementRepr) {
  // Снять обработчики событий
  elem.eventListeners.forEach((listener) => {
    elem.node.removeEventListener(listener.type, listener.listener);
  });
  elem.eventListeners = [];
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('ON_')) {
      if (typeof value !== 'function') {
        throw new Error('Event handler should be function');
      }
      const eventType = key.slice(3);
      elem.node.addEventListener(eventType, value as EventListener);
      elem.eventListeners.push({
        type: eventType,
        listener: value as EventListener,
      });
    } else if (key !== 'children')
      if (
        !elem.existingAttrs.has(key) ||
        elem.existingAttrs.get(key) !== value
      ) {
        const stringVal = value as string;
        elem.existingAttrs.set(key, stringVal.toString());
        elem.node.setAttribute(key, stringVal.toString());
      }
  });
}

export class ComponentInstance<
  PropsType extends ComponentProps = ComponentProps
> {
  func: IComponentFunction<PropsType>;
  depth: number;
  props: any;
  state: any[] = [];
  componentName: string = 'Unknown';
  private instanceMap: Map<string, ComponentInstance<PropsType>> = new Map(); // Карта для хранения инстансов
  vTree: JsxSubtree = [];
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
    const ret: Node[] = [];
    let i: number = 0;
    this.vTree.forEach((vNode) => {
      if (vNode.nodeType === 'TextNode' || vNode.nodeType === 'JSXElement') {
        if (i >= this.domNodes.length) {
          throw new RangeError('vTree and domNodes are not aligned');
        }
        ret.push(this.domNodes[i].node);
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
    _unsetUpdatedInstance();
    this.vTree = newVTree;
  }

  /** Построить vTree, создать инстансы подкомпонентов и создать DOM-узлы */
  private create() {
    // Построить vTree
    this.updateVTree();
    // Создать инстансы подкомпонентов
    this.patchInstances();
    // Создать DOM-узлы
    this.patchDomNodes(this.domNodes, this.vTree);
  }

  update() {
    // Обновить vTree
    this.updateVTree();
    // Обновить под-инстансы и удалить неактуальные
    this.patchInstances();
    // Пропатчить DOM
    this.patchDomNodes(this.domNodes, this.vTree);
  }
  private patchInstances() {
    // Получить список всех элементов из нового vTree
    const allElements = new Map<string, JsxComponentElement>();
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
    vSubtree: JsxSubtree,
    allElements: Map<string, JsxComponentElement>
  ) {
    vSubtree.forEach((vNode) => {
      if (vNode.nodeType === 'JSXElement') {
        this.getElementsFromVTree(vNode.children, allElements);
      } else if (vNode.nodeType === 'ComponentElement') {
        if (allElements.has(vNode.key)) {
          throw new Error(`Duplicating key: ${vNode.key}`);
        }
        allElements.set(vNode.key, vNode);
      }
    });
  }
  /**
   * Пропатчить DOM-узлы этого компонента
   * @param nodes Представление существующих DOM-узлов
   * @param vTr Виртуальное дерево, с которым сравниваться
   * @param reattachMode Режим переприкрепления дочерних узлов: none - не прикреплять,
   * firstNode - "навесить" ветки как sibling'и для первого узла в массиве nodes,
   * replace - заменить детей у родительского узла
   */
  private patchDomNodes(
    nodes: DOMNodeRepr[],
    vTr: JsxSubtree,
    parent: Element | null = null
  ) {
    let domIndex = 0;
    let prevNode: Node | null = null;
    if (nodes.length) {
      prevNode = nodes[0].node.previousSibling;
    }

    vTr.forEach((vNode, vIndex) => {
      if (vNode.nodeType === 'ComponentElement') {
        const instance = this.instanceMap.get(vNode.key);
        if (instance === undefined) {
          throw new Error(`Key: ${vNode.key} not exists in instanceMap`);
        }
        instance.getMountNodes().forEach((node) => {
          if (prevNode === null) {
            if (parent !== null) {
              parent.insertBefore(node, parent.firstChild);
            }
          } else {
            if (prevNode.parentElement !== null) {
              prevNode.parentElement.insertBefore(node, prevNode.nextSibling);
            }
          }
          prevNode = node;
        });
      } else {
        let rawNode: DOMNodeRepr;
        const corrDomNode = nodes[domIndex];
        if (
          domIndex >= nodes.length ||
          (corrDomNode.nodeType === 'Element' &&
            vNode.nodeType === 'TextNode') ||
          (corrDomNode.nodeType === 'TextNode' &&
            vNode.nodeType === 'JSXElement') ||
          (corrDomNode.nodeType === 'Element' &&
            vNode.nodeType === 'JSXElement' &&
            corrDomNode.node.tagName !== vNode.tagName)
        ) {
          // Если надо добавить узел или узел имеет не тот тип
          if (vNode.nodeType === 'JSXElement') {
            rawNode = {
              nodeType: 'Element',
              node: document.createElement(vNode.tagName),
              children: [],
              eventListeners: [],
              existingAttrs: new Map(),
            };
          } else {
            rawNode = {
              nodeType: 'TextNode',
              node: document.createTextNode('UNSET'),
            };
          }
          // Если узел заменяется, заменить старый на новый в родителе
          if (domIndex < nodes.length) {
            const oldNode = nodes[domIndex];
            if (oldNode.node.parentElement !== null) {
              oldNode.node.parentElement.replaceChild(
                rawNode.node,
                oldNode.node
              );
            }
          }
          // Если создаётся новый узел, выставить его
          if (domIndex >= nodes.length) {
            if (parent !== null) {
              if (prevNode === null) {
                parent.insertBefore(rawNode.node, parent.firstChild);
              } else {
                parent.insertBefore(rawNode.node, prevNode.nextSibling);
              }
            }
          }
          // Обновить массив nodes
          nodes.splice(domIndex, 1, rawNode);
        } else {
          // Если узел существует и имеет правильный тип
          rawNode = nodes[domIndex];
        }
        // Патчим пропсы и добавляем дочерние элементы
        if (rawNode.nodeType === 'Element') {
          const vElem = vNode as JsxHtmlElement;
          patchProps(vElem.props, rawNode);
          this.patchDomNodes(rawNode.children, vElem.children, rawNode.node);
        } else if (rawNode.nodeType === 'TextNode') {
          const vTextNode = vNode as JsxTextNode;
          if (rawNode.node.textContent !== vTextNode.text) {
            rawNode.node.textContent = vTextNode.text;
          }
        }
        prevNode = rawNode.node;
        domIndex++;
      }
    });
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
