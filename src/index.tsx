import { RenderJSX } from "./jsx_core/renderer.js";
const someElements = (
  <>
    <a href="https://example.com"><div>dfdf</div></a>
    <h1 href="https://example.com">adsadsf</h1>
  </>
);

console.log("someElements",someElements)

const root = document.getElementById("root");
if (root != null) {
  RenderJSX(root, someElements);
}
