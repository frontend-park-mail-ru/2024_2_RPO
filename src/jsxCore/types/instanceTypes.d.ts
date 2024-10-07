import { ComponentFunction, NormalizedChildren } from './elementTypes';

export interface IComponentInstance {
  depth: number; // Уровень вложенности
  func: ComponentFunction;
  state: any[];
  props: object;
  vTree: NormalizedChildren;
}
