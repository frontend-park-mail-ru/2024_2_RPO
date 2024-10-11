export type IComponentFunction<
  PropsType extends ComponentProps = ComponentProps
> = (props?: PropsType) => [componentName: string, vSubtree: JsxSubtree];

export interface JsxTextNode {
  nodeType: 'TextNode';
  text: string;
}

export interface JsxHtmlElement {
  nodeType: 'JSXElement';
  tagName: string;
  props: any;
  children: JsxSubtree;
}

export interface JsxComponentElement {
  nodeType: 'ComponentElement';
  func: IComponentFunction;
  key: string;
  props: any;
  children: JsxSubtree;
}

export type JsxNode = JsxHtmlElement | JsxComponentElement | JsxTextNode;
export type JsxSubtree = JsxNode[];

export interface ComponentProps {
  key: string;
}
