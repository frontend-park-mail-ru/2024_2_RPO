import { ComponentFunction, NormalizedChildren } from './elementTypes';

export interface IComponentInstance {
  func: ComponentFunction;
  state: any[];
  props: object;
  cleanTree: NormalizedChildren;
  dirtyTree?: NormalizedChildren;
}
