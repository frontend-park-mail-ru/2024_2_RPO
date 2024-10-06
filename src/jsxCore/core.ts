import { IComponentInstance } from "./types/elementTypes";

export class ComponentInstance implements IComponentInstance {
  props: Map<string, any> = new Map();
}
