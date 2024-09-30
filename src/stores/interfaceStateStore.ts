import { boardsStore } from './boardsStore.js';
import { RenderJSX } from '/jsxCore/renderer.js';
import { HomePage } from '/screens/HomePage.js';
import { MainApp } from '/screens/MainApp.js';
import { AppState } from '/types/appState.js';
import { HomePageState } from '/types/homePageState.js';
import { User } from '/types/user.js';
import { Board } from '/types/board.js';
import { getBoards } from '/api/boards.js';
import { getUserMe } from '/api/users.js';

const modeToView = {
  app: MainApp,
  homePage: HomePage,
};

class InterfaceStateStore {
  mode: 'homePage' | 'app' = 'homePage';
  state: HomePageState | AppState = new HomePageState();
  me?: User;
  appRoot: Element;
  constructor(appRoot: Element) {
    this.appRoot = appRoot;
  }
  /** Перерисовать приложение */
  update() {
    if (document.location.href.match(/app$/)) {
      if (this.mode !== 'app') {
        if (this.me !== undefined) {
          this.mode = 'app';
          this.state = new AppState();
        } else {
          this.mode = 'homePage';
          this.state = new HomePageState();
        }
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
  /**
   * Обновить информацию о текущем пользователе и о его доступных досках, затем перерисовать
   */
  updateRegAndApp() {
    getUserMe()
      .then((user) => {
        this.me = user;
        if (this.me === undefined) {
          this.mode = 'homePage';
          this.state = new HomePageState();
          history.pushState(null, '', '/');
          this.update();
        } else {
          this.mode = 'app';
          this.state = new AppState();
          history.pushState(null, '', '/app');
          getBoards()
            .then((boards: Board[]) => {
              boardsStore.boards = boards;
              this.update();
            })
            .catch(() => {
              alert('Скорее всего, лежит бэк');
              this.update();
            });
        }
      })
      .catch(() => {
        alert('Скорее всего, лежит бэк');
        this.update();
      });
  }
}

const appRoot = document.getElementById('app_root');
export let interfaceStateStore: InterfaceStateStore | undefined = undefined;

/**
 * Инициализировать Interface State Store
 */
export const initISS = ():void => {
  if (appRoot !== null) {
    interfaceStateStore = new InterfaceStateStore(appRoot);
  } else {
    throw new Error('App root is null');
  }
};

/**
 * Получить состояние канбана
 * @returns Состояние приложения для экрана канбана
 */
export const getAppISS = (): AppState => {
  if (interfaceStateStore?.mode === 'app') {
    if (interfaceStateStore.state instanceof AppState) {
      return interfaceStateStore.state;
    }
  }
  throw new Error('You are on another screen');
};

/**
 * Получить состояние домашней страницы
 * @returns Состояние приложения для экрана домашней страницы
 */
export const getHomePageISS = (): HomePageState => {
  if (interfaceStateStore?.mode === 'homePage') {
    if (interfaceStateStore.state instanceof HomePageState) {
      return interfaceStateStore.state;
    }
  }
  throw new Error('You are on another screen');
};


export const goToApp = () => {
  history.pushState(null, '', '/app');
  interfaceStateStore?.update();
};
