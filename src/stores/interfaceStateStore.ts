import { boardsStore } from '@/stores/boardsStore';
import { AppState } from '@/types/appState';
import { HomePageState } from '@/types/homePageState';
import { User } from '@/types/user';
import { Board } from '@/types/board';
import { getBoards } from '@/api/boards';
import { getUserMe } from '@/api/users';

// const modeToView = {
//   app: MainApp,
//   homePage: HomePage,
// };

class InterfaceStateStore {
  mode: 'homePage' | 'app' = 'homePage';
  homePageState: HomePageState;
  appState: AppState;
  me?: User;
  constructor() {
    this.homePageState = new HomePageState();
    this.appState = new AppState();
    this.update();
  }
  /** Перерисовать приложение */
  update() {
    if (document.location.href.match(/app$/)) {
      if (this.mode !== 'app') {
        if (this.me !== undefined) {
          this.mode = 'app';
          this.appState = new AppState();
        } else {
          this.mode = 'homePage';
          this.homePageState = new HomePageState();
        }
      }
    } else {
      if (this.mode !== 'homePage') {
        this.mode = 'homePage';
        this.homePageState = new HomePageState();
      }
    }
    //const app = modeToView[this.mode]();
    //RenderJSX(this.appRoot, app);
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
          this.homePageState = new HomePageState();
          history.pushState(null, '', '/');
          this.update();
        } else {
          this.mode = 'app';
          this.appState = new AppState();
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

export const interfaceStateStore = new InterfaceStateStore();

export const goToApp = () => {
  history.pushState(null, '', '/app');
  interfaceStateStore?.update();
};
