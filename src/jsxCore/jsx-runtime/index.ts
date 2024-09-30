import { JSXInternal as _JSX } from './jsx';

export interface JSXNode {
  type: string;
  props: object;
  children: JSXChildType[];
  key?: string;
}

export type JSXChildType = JSXNode | string;

type propsType = _JSX.HTMLAttributes &
  _JSX.SVGAttributes & { children?: JSXChildType | JSXChildType[] | undefined };

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace JSX {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface IntrinsicElements extends _JSX.IntrinsicElements {}
}

const Fragment = '';

const normalizeChildren = (
  children: JSXChildType | JSXChildType[] | undefined
): JSXChildType[] => {
  if (Array.isArray(children)) return children;
  if (children === undefined) return [];
  return [children];
};

function jsx(
  type: string,
  props: propsType,
  key?: string
): JSXNode | JSXChildType[] {
  if (key !== undefined) {
    console.log("jsx argument 'key' was provided with value: ", key);
    throw new Error('not implemented');
  }
  const children = normalizeChildren(props.children);
  if (type === Fragment) {
    return children;
  } else {
    const ret: JSXNode = { type, props, children };
    return ret;
  }
}
function jsxTemplate(): void {
  throw new Error('Not implemented');
}
function jsxAttr(): void {
  throw new Error('Not implemented');
}
function jsxEscape(): void {
  throw new Error('Not implemented');
}

export {
  jsx,
  jsx as jsxs,
  jsx as jsxDEV,
  Fragment,
  jsxTemplate,
  jsxAttr,
  jsxEscape,
  JSX,
};
