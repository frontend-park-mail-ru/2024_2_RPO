export type JSXTextNode = string;

export type IComponentFunction<PropsType = any> = (
  props?: PropsType
) => [componentName: string, vSubtree: NormalizedChildren];

export interface JSXElement {
  elementType: 'JSXElement';
  tagName: string;
  props: Map<string, string>;
  children: NormalizedChildren;
}

export interface IComponentElement {
  elementType: 'ComponentElement';
  func: IComponentFunction;
  key: string;
  props: any;
  children: NormalizedChildren;
}

export type JSXChildType = JSXElement | IComponentElement | JSXTextNode;
export type JSXChildrenType =
  | JSXChildType
  | (JSXChildType | undefined)[]
  | undefined;
export type NormalizedChildren = JSXChildType[];

export interface ComponentProps {
  key: string;
}
