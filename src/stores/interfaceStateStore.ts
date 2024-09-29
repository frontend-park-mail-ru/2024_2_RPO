import { RenderJSX } from '/jsxCore/renderer.js';
import { HomePage } from '/screens/HomePage.js';
import { MainApp } from '/screens/MainApp.js';
import { AppState } from '/types/appState.js';
import { HomePageState } from '/types/homePageState.js';

class InterfaceStateStore {
  mode: 'homePage' | 'app';
  state: HomePageState | AppState;
  appRoot: Element;
  constructor(appRoot: Element | null) {
    if (appRoot === null) throw new Error('appRoot is null');
    else this.appRoot = appRoot;
    this.mode = 'homePage';
    this.state = new HomePageState();
  }
  update() {
    let app;
    if (document.location.href.endsWith('app')) {
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
    if (this.mode === 'app') {
      app = MainApp();
    } else {
      app = HomePage();
    }
    RenderJSX(this.appRoot, app);
  }
}

const appRoot = document.getElementById('app_root');
export let interfaceStateStore: InterfaceStateStore | undefined = undefined;

export const initISS = () => {
  interfaceStateStore = new InterfaceStateStore(appRoot);
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
  console.log(interfaceStateStore?.state);
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
