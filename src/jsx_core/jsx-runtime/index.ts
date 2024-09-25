import { JSXInternal as _JSX } from "./jsx";

export interface JSXNode {
  type: string;
  props: object;
  children: JSXChildType[];
  key?: string;
}

export type JSXChildType = JSXNode | string;

type propsType = _JSX.HTMLAttributes &
  _JSX.SVGAttributes & { children?: JSXChildType | JSXChildType[] | undefined };

export namespace JSX {
  export interface IntrinsicElements extends _JSX.IntrinsicElements {}
}

const Fragment = "";

const normalizeChildren = (
  children: JSXChildType | JSXChildType[] | undefined
): JSXChildType[] => {
  if (Array.isArray(children)) return children;
  if (children == undefined) return [];
  return [children];
};

function jsx(
  type: string,
  props: propsType,
  key?: string
): JSXNode | JSXChildType[] {
  const children = normalizeChildren(props.children);
  if (type == Fragment) {
    return children;
  } else {
    const ret: JSXNode = { type, props, children };
    return ret;
  }
}
function jsxTemplate(): void {
  console.log(arguments);
}
function jsxAttr(): void {
  console.log(arguments);
}
function jsxEscape(): void {
  console.log(arguments);
}

export {
  jsx,
  jsx as jsxs,
  jsx as jsxDEV,
  Fragment,
  // precompiled JSX transform
  jsxTemplate,
  jsxAttr,
  jsxEscape,
};
