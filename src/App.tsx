import { RenderJSX } from './jsx_core/renderer.js';
import { MainApp } from './screens/MainApp.js';

const app = MainApp()

const appRoot_raw = document.getElementById('app_root');
let appRoot: Element;
if (appRoot_raw === null) {
  throw new Error('App root not found');
} else {
  appRoot = appRoot_raw;
}

RenderJSX(appRoot, app);
