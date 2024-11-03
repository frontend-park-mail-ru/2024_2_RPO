import { deepEqual } from '@/utils/deepEqual';
import { _setUpdatedInstance, _unsetUpdatedInstance } from './hooks';
import {
  JsxComponentElement,
  IComponentFunction,
  JsxSubtree,
  ComponentProps,
  JsxHtmlElement,
  JsxTextNode,
  RefsMap,
} from './types';
import { _removeFromUpdateQueue, markDirty } from './updateQueue';
import { _unsubscribeFromStores } from './hooks';

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
    if (value === undefined) {
      return;
    }
    if (key === 'className') {
      let newValue: string = '';
      if (Array.isArray(value)) {
        newValue = value.join(' ');
      } else if (typeof value === 'string') {
        newValue = value;
      }
      if (elem.node.getAttribute('class') !== newValue) {
        elem.node.setAttribute('class', newValue);
      }
    } else if (key.startsWith('ON_')) {
      if (typeof value !== 'function' && typeof value !== 'undefined') {
        throw new Error('Event handler should be function');
      }
      const eventType = key.slice(3);
      if (value !== undefined) {
        elem.node.addEventListener(eventType, value as EventListener);
      }
      elem.eventListeners.push({
        type: eventType,
        listener: value as EventListener,
      });
    } else if (key !== 'children') {
      if (
        !elem.existingAttrs.has(key) ||
        elem.existingAttrs.get(key) !== value
      ) {
        const stringVal = value as string;
        elem.existingAttrs.set(key, stringVal.toString());
        const prevValue = elem.node.getAttribute(key);
        if (stringVal.toString() !== prevValue) {
          elem.node.setAttribute(key, stringVal.toString());
        }
      }
    }
  });
}

export class ComponentInstance<
  PropsType extends ComponentProps = ComponentProps
> {
  func: IComponentFunction<PropsType>;
  depth: number; // Глубина нужна для того, чтобы планировщик обновления отдавал предпочтение более корневому инстансу
  props: any;
  state: any[] = [];
  componentName: string = 'Unknown';
  private instanceMap: Map<string, ComponentInstance<PropsType>> = new Map(); // Карта для хранения инстансов
  vTree: JsxSubtree = [];
  parent?: ComponentInstance<any>;
  domNodes: DOMNodeRepr[] = []; // Только те DOM-узлы, которые принадлежат этому компоненту; узлы подкомпонентов не включаются
  // Массивы для поддержки хуков useEffect и useEffectRefs
  refEffects: ((refs: RefsMap) => void)[] = [];
  effects: (() => void)[] = [];

  constructor(
    func: IComponentFunction<PropsType>,
    parent: ComponentInstance<any> | undefined,
    props: any = new Map()
  ) {
    this.componentName = func.name;
    this.parent = parent;
    this.depth = parent !== undefined ? parent.depth + 1 : 0;
    this.func = func;
    this.props = props;
    this.update();
  }
  /**
   * Получить список узлов верхнего уровня (в список включены узлы, созданные подкомпонентами)
   */
  getMountNodes(): Node[] {
    const nodesToMount: Node[] = [];
    let i: number = 0;
    this.vTree.forEach((vNode) => {
      if (vNode.nodeType === 'TextNode' || vNode.nodeType === 'JSXElement') {
        if (i >= this.domNodes.length) {
          this._errorInfo();
          throw new RangeError('vTree and domNodes are not aligned');
        }
        nodesToMount.push(this.domNodes[i].node);
        i++;
      } else {
        // ComponentElement
        const instance = this.instanceMap.get(vNode.key);
        if (!instance) {
          this._errorInfo();
          throw new Error(
            `No matching instance in instanceMap with key='${vNode.key}'`
          );
        }
        nodesToMount.push(...instance.getMountNodes());
      }
    });
    return nodesToMount;
  }
  /** Обновить vTree, запустив функцию и получив новое дерево */
  private _updateVTree() {
    _setUpdatedInstance(this);
    this.vTree = this.func(this.props);
    _unsetUpdatedInstance();
    if (!Array.isArray(this.vTree)) {
      this.vTree = [this.vTree];
    }
  }
  update() {
    this.refEffects = [];
    this.effects = [];
    // Обновить vTree
    this._updateVTree();
    // Обновить под-инстансы и удалить неактуальные
    this._patchInstances();
    // Пропатчить DOM
    if (this.domNodes.length) {
      this._patchDomNodes(
        this.domNodes,
        this.vTree,
        this.domNodes[0].node.parentElement
      );
    } else {
      this._patchDomNodes(this.domNodes, this.vTree);
    }
    this.effects.forEach((fn) => {
      fn();
    });
    if (this.refEffects.length) {
      const refsMap = this._collectRefs(this.domNodes);
      this.refEffects.forEach((fn) => {
        fn(refsMap);
      });
    }
  }
  /**
   * Обновить instanceMap
   */
  private _patchInstances() {
    // Получить список всех элементов из нового vTree
    const allElements = new Map<string, JsxComponentElement>();
    this._getElementsFromVTree(this.vTree, allElements);

    // Удалить неактуальные под-инстансы
    const allKeys = new Set<string>(allElements.keys());
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
  private _getElementsFromVTree(
    vSubtree: JsxSubtree,
    allElements: Map<string, JsxComponentElement>
  ) {
    vSubtree.forEach((vNode) => {
      if (vNode.nodeType === 'JSXElement') {
        this._getElementsFromVTree(vNode.children, allElements);
      } else if (vNode.nodeType === 'ComponentElement') {
        if (allElements.has(vNode.key)) {
          this._errorInfo();
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
  private _patchDomNodes(
    nodes: DOMNodeRepr[],
    vTr: JsxSubtree,
    parent: Element | null = null
  ) {
    let domIndex = 0;
    let prevNode: Node | null = null;
    if (nodes.length) {
      prevNode = nodes[0].node.previousSibling;
    }

    vTr.forEach((vNode) => {
      if (vNode.nodeType === 'ComponentElement') {
        const instance = this.instanceMap.get(vNode.key);
        if (instance === undefined) {
          this._errorInfo();
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
            corrDomNode.node.tagName !== vNode.tagName.toUpperCase())
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
          this._patchDomNodes(rawNode.children, vElem.children, rawNode.node);
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
    while (domIndex < nodes.length) {
      nodes[domIndex].node.parentNode?.removeChild(nodes[domIndex].node);
      nodes.splice(domIndex, 1);
    }
  }
  /** Погубить инстанс */
  destroy() {
    // Просто удалить себя из DOM-дерева
    this.getMountNodes().forEach((node) => {
      node.parentElement?.removeChild(node);
    });
    this.instanceMap.forEach((instance) => {
      instance.destroy();
    });
    _unsubscribeFromStores(this);
    _removeFromUpdateQueue(this);
  }
  /** Вывести информацию о том, в каком инстансе мы сейчас находимся */
  private _errorInfo() {
    if (this.parent !== undefined) {
      this.parent._errorInfo();
    }
    console.error(`At component ${this.componentName}`);
  }
  private _collectRefs(subtree: DOMNodeRepr[]): RefsMap {
    const refsMap: RefsMap = new Map();
    subtree.forEach((node) => {
      if (node.nodeType === 'Element') {
        const ref = node.node.getAttribute('ref');
        if (ref !== null) {
          refsMap.set(ref, node.node);
        }
        const childsMap = this._collectRefs(node.children);
        childsMap.forEach((value, key) => {
          refsMap.set(key, value);
        });
      }
    });
    return refsMap;
  }
}

export function createApp(func: IComponentFunction, mountTo: Element) {
  const mainInstance = new ComponentInstance(func, undefined, new Map());
  mountTo.replaceChildren(...mainInstance.getMountNodes());
}
