import { RenderJSX } from '/jsxCore/renderer.js';
import { Landing } from '/screens/Landing.js';
import { MainApp } from '/screens/MainApp.js';

class InterfaceStateStore {
  mode: 'landing' | 'app';
  state: LandingState | AppState;
  appRoot: Element;
  constructor(appRoot: Element | null) {
    if (appRoot === null) throw new Error('appRoot is null');
    else this.appRoot = appRoot;
    this.mode = 'app'; //todo роутер
    this.state = new AppState();
  }
  update() {
    let app;
    if (this.mode === 'app') {
      app = MainApp();
    } else {
      app = Landing();
    }
    RenderJSX(this.appRoot, app);
  }
}
class LandingState {
  isRegistrationDialogOpened: boolean;
  isLoginDialogOpened: boolean;
  constructor() {
    this.isRegistrationDialogOpened = false;
    this.isLoginDialogOpened = false;
  }
}
class AppState {
  isBoardDeleteDialogOpened: boolean;
  isLeftPanelOpened: boolean;
  isNewBoardDialogOpened: boolean;
  boardDeleteDialogCallback: (() => void) | undefined;
  constructor() {
    this.isBoardDeleteDialogOpened = false;
    this.isLeftPanelOpened = false;
    this.isNewBoardDialogOpened = false;
    this.boardDeleteDialogCallback = undefined;
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

export const getLandingISS = (): LandingState => {
  if (interfaceStateStore?.mode === 'landing') {
    if (interfaceStateStore.state instanceof LandingState) {
      return interfaceStateStore.state;
    }
  }
  throw new Error('You are on another screen');
};
