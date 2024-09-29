import { boardsStore } from './boardsStore.js';
import { getApiUrl } from '/apiHelper.js';
import { RenderJSX } from '/jsxCore/renderer.js';
import { HomePage } from '/screens/HomePage.js';
import { MainApp } from '/screens/MainApp.js';
import { AppState } from '/types/appState.js';
import { HomePageState } from '/types/homePageState.js';
import { User } from '/types/user.js';
import { Board } from '/types/board.js';

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
  updateRegAndApp() {
    fetch(getApiUrl('/users/me'), {
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 200) {
          res
            .json()
            .then((userData) => {
              this.me = userData;
              this.mode = 'app';
              this.state = new AppState();
              history.pushState(null, '', '/app');

              fetch(getApiUrl('/boards/my'), {
                credentials: 'include',
              }).then((resp) => {
                resp.json().then((json) => {
                  boardsStore.boards = json.map((el: any): Board => {
                    return { id: el.id, title: el.name };
                  });
                });
              });

              this.update();
            })
            .catch((err) => {
              console.log(err);
              this.update();
            });
        } else if (res.status === 401) {
          history.pushState(null, '', '/');
          this.update();
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          'Скорее всего, отвалился backend. Перезагрузите страницу, мб поможет'
        );
      });
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
  fetch(getApiUrl('/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  }).then(() => {
    history.pushState(null, '', '/');
    interfaceStateStore?.update();
  });
};

export const goToApp = () => {
  //TODO проверка логина
  history.pushState(null, '', '/app');
  interfaceStateStore?.update();
};
