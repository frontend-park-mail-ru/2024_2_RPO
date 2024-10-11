import { JSXInternal as _JSX } from './jsx';
import {
  JsxHtmlElement,
  IComponentFunction,
  JsxSubtree,
  JsxComponentElement,
  JsxNode,
} from '../types';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace JSX {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface IntrinsicElements extends _JSX.IntrinsicElements {}
}

const Fragment = 'fragment';

// То, что может лежать в props.children
type JSXChildrenType =
  | (JsxNode | string)
  | (JsxNode | string | undefined)[]
  | undefined;

const normalizeChildren = (children: JSXChildrenType): JsxSubtree => {
  if (Array.isArray(children)) {
    return children
      .filter((vNode) => {
        return vNode !== undefined;
      })
      .map((vNode) => {
        if (typeof vNode === 'string') {
          return { nodeType: 'TextNode', text: vNode };
        } else {
          return vNode;
        }
      });
  }
  if (children === undefined) {
    return [];
  }
  if (typeof children === 'string') {
    return [{ nodeType: 'TextNode', text: children }];
  }
  return [children];
};

function jsx(
  type: string | IComponentFunction | 'fragment',
  props: any,
  key?: string
): JsxSubtree | JsxComponentElement | JsxHtmlElement {
  const children = normalizeChildren(props.children);
  props.children = children;

  if (type === Fragment) {
    // Фрагмент (несколько веток)
    if (key !== undefined) {
      throw new Error('Key should be used for components only');
    }
    return children;
  } else if (typeof type === 'function') {
    // Функциональный компонент
    if (key === undefined) {
      throw new Error('Every component should have a key');
    }
    const ret: JsxComponentElement = {
      nodeType: 'ComponentElement',
      func: type,
      children,
      props,
      key,
    };
    return ret;
  } else if (typeof type === 'string') {
    // Обычный HTML-элемент
    if (key !== undefined) {
      throw new Error('Key should be used for components only');
    }
    const ret: JsxHtmlElement = {
      nodeType: 'JSXElement',
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
