import { JSXChildType } from '@/jsxCore/jsx-runtime';

export function RenderJSX(root: Element, fragment: JSXChildType[]): void {
  while (root.lastChild !== null) {
    root.removeChild(root.lastChild);
  }
  fragment.forEach((child) => {
    if (child === undefined) return;
    let newNode: Node;
    if (typeof child === 'string') {
      newNode = document.createTextNode(child);
    } else {
      const newElement = document.createElement(child.type);

      Object.entries(child.props).forEach((entry) => {
        const [attrName, attrValue] = entry;
        switch (attrName) {
          case 'children':
            break;
          case 'class':
            if (Array.isArray(attrValue)) {
              attrValue.forEach((cn) => {
                if (typeof cn === 'string') newElement.classList.add(cn);
              });
            } else {
              newElement.setAttribute(attrName, attrValue.toString());
            }
            break;
          default:
            if (attrName.startsWith('ON_')) {
              if (typeof attrValue !== 'function') {
                throw new Error('Event cb should be func');
              }
              const eventName = attrName.slice(3);
              newElement.addEventListener(eventName, attrValue);
            } else {
              newElement.setAttribute(attrName, attrValue.toString());
            }
            break;
        }
      });

      RenderJSX(newElement, child.children);
      newNode = newElement;
    }
    root.appendChild(newNode);
  });
}
