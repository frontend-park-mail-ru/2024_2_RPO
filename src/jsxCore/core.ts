import { _setUpdatedInstance, _unsetUpdatedInstance } from './hooks';
import { ComponentFunction, NormalizedChildren } from './types/elementTypes';
import { IComponentInstance } from './types/instanceTypes';

export class ComponentInstance implements IComponentInstance {
  func: ComponentFunction;
  depth: number;
  props: object = {};
  state: any[] = [];
  vTree: NormalizedChildren = [];
  parent: IComponentInstance;
  domNodes: Node[] = [];
  constructor(
    func: ComponentFunction,
    parent: IComponentInstance,
    props: object
  ) {
    this.parent = parent;
    this.depth = parent.depth + 1;
    this.func = func;
    this.props = props;
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
