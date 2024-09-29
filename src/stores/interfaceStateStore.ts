import { RenderJSX } from '/jsxCore/renderer.js';
import { HomePage } from '/screens/HomePage.js';
import { MainApp } from '/screens/MainApp.js';
import { AppState } from '/types/appState.js';
import { HomePageState } from '/types/homePageState.js';

const modeToView = {
  app: MainApp,
  homePage: HomePage,
};

class InterfaceStateStore {
  mode: 'homePage' | 'app' = 'homePage';
  state: HomePageState | AppState = new HomePageState();
  appRoot: Element;
  constructor(appRoot: Element) {
    this.appRoot = appRoot;
  }
  update() {
    if (document.location.href.match(/app$/)) {
      if (this.mode !== 'app') {
        this.mode = 'app';
        this.state = new AppState();
      }
    } else {
      if (this.mode !== 'homePage') {
        this.mode = 'homePage';
        this.state = new HomePageState();
      }
    }
    const app = modeToView[this.mode]();
    RenderJSX(this.appRoot, app);
  }
}

const appRoot = document.getElementById('app_root');
export let interfaceStateStore: InterfaceStateStore | undefined = undefined;

export const initISS = () => {
  if (appRoot !== null) {
    interfaceStateStore = new InterfaceStateStore(appRoot);
  } else {
    throw new Error('App root is null');
  }
};

export const getAppISS = (): AppState => {
  if (interfaceStateStore?.mode === 'app') {
    if (interfaceStateStore.state instanceof AppState) {
      return interfaceStateStore.state;
    }
  }
  throw new Error('You are on another screen');
};

export const getHomePageISS = (): HomePageState => {
  if (interfaceStateStore?.mode === 'homePage') {
    if (interfaceStateStore.state instanceof HomePageState) {
      return interfaceStateStore.state;
    }
  }
  throw new Error('You are on another screen');
};

export const logout = () => {
  //TODO выход
  history.pushState(null, '', '/');
  interfaceStateStore?.update();
};

export const goToApp = () => {
  //TODO проверка логина
  history.pushState(null, '', '/app');
  interfaceStateStore?.update();
};
