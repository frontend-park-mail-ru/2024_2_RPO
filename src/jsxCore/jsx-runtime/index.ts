import { JSXInternal as _JSX } from './jsx';
import {
  JSXElement,
  JSXTextNode,
  JSXChildrenType,
  JSXChildType,
  ComponentFunction,
  NormalizedChildren,
  IComponentElement,
  IAbstractElement,
} from '../types/elementTypes';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace JSX {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface IntrinsicElements extends _JSX.IntrinsicElements {}
}

const Fragment = 'fragment';

const normalizeChildren = (children: JSXChildrenType): NormalizedChildren => {
  if (Array.isArray(children)) return children;
  if (children === undefined) return [];
  return [children];
};

function jsx(
  type: string | ComponentFunction | 'fragment',
  props: any,
  key?: string
): IAbstractElement | NormalizedChildren {
  const children = normalizeChildren(props.children);
  props.children = children;

  if (type === Fragment) {
    if (key !== undefined) {
      throw new Error('Key should be used for components only');
    }
    return children;
  } else if (typeof type === 'function') {
    const ret: IComponentElement = {
      func: type,
      instance: null,
      children,
      props,
      key,
    };
    return ret;
  } else {
    if (key !== undefined) {
      throw new Error('Key should be used for components only');
    }
    const ret: JSXElement = { tagName: type, props, children };
    return ret;
  }
}
function jsxTemplate(): void {
  throw new Error('jsxTemplate(): Not implemented');
}
function jsxAttr(): void {
  throw new Error('jsxAttr(): Not implemented');
}
function jsxEscape(): void {
  throw new Error('jsxEscape(): Not implemented');
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
