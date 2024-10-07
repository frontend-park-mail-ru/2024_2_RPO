import { JSXInternal as _JSX } from './jsx';
import {
  JSXElement,
  JSXChildrenType,
  IComponentFunction,
  NormalizedChildren,
  IComponentElement,
} from '../types/elementTypes';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace JSX {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface IntrinsicElements extends _JSX.IntrinsicElements {}
}

const Fragment = 'fragment';

const normalizeChildren = (children: JSXChildrenType): NormalizedChildren => {
  if (Array.isArray(children)) {
    return children.filter((el) => {
      return el !== undefined;
    });
  }
  if (children === undefined) {
    return [];
  }
  return [children];
};

function jsx(
  type: string | IComponentFunction | 'fragment',
  props: any,
  key?: string
): NormalizedChildren | IComponentElement | JSXElement {
  const children = normalizeChildren(props.children);
  props.children = children;

  if (type === Fragment) {
    if (key !== undefined) {
      throw new Error('Key should be used for components only');
    }
    return children;
  } else if (typeof type === 'function') {
    if (key === undefined) {
      throw new Error('Every component should have a key');
    }
    const ret: IComponentElement = {
      elementType: 'ComponentElement',
      func: type,
      children,
      props,
      key,
    };
    return ret;
  } else if (typeof type === 'string') {
    if (key !== undefined) {
      throw new Error('Key should be used for components only');
    }
    const ret: JSXElement = {
      elementType: 'JSXElement',
      tagName: type,
      props,
      children,
    };
    return ret;
  }
  throw new Error('Error in JSX function: type is used wrong');
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
