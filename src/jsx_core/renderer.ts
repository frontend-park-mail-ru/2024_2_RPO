import { JSXChildType, JSXNode } from "/jsx_core/jsx-runtime";

export function RenderJSX(root: Element, fragment: JSXChildType[]): void {
  root.childNodes.forEach((child) => {
    root.removeChild(child);
  });
  fragment.forEach((child) => {
    let newNode: Node;
    if (typeof child == "string") {
      newNode = document.createTextNode(child);
    } else {
      const newElement = document.createElement(child.type);
      Object.entries(child.props).forEach((entry) => {
        if (entry[0] != "children")
          newElement.setAttribute(entry[0], entry[1].toString());
      });
      console.log("child.children", child.children);
      RenderJSX(newElement, child.children);
      newNode = newElement;
    }
    root.appendChild(newNode);
    console.log(newNode);
  });
}
