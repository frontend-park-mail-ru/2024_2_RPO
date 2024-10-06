import { IComponentInstance } from "./instanceTypes";

export type JSXTextNode = string;

export type ComponentFunction = (props?: object) => JSXChildrenType;

export interface IAbstractElement {
  props: object;
  children: JSXChildType[];
}

export interface JSXElement extends IAbstractElement {
  tagName: string;
}

export interface IComponentElement extends IAbstractElement {
  func: ComponentFunction;
  instance: null | IComponentInstance;
  key?: string;
}

export type JSXChildType = JSXElement | JSXTextNode | IComponentElement;
export type JSXChildrenType = JSXChildType | JSXChildType[] | undefined;
export type NormalizedChildren = JSXChildType[];
