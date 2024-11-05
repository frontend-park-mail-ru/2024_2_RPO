import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { setApiUrl } from './api/apiHelper';
import { MainApp } from './screens/MainApp';
import { useRouterStore } from './stores/routerStore';
import { ToastContainer } from './containers/ToastContainer';
import { apiUrl } from './config';
import { updateMe } from './stores/meStore';
import { loadBoard } from './stores/activeBoardStore';
import { updateBoards } from './stores/boardsStore';

setApiUrl(apiUrl);

const App: IComponentFunction = () => {
  const routerStore = useRouterStore();
  console.log('Router store: ', routerStore);

  return (
    <>
      <div class="display-none"></div>
      {routerStore.isApp ? (
        <MainApp key="main_app" />
      ) : (
        <HomePage key="home_page" />
      )}
      <ToastContainer key="toast_container" />
    </>
  );
};

loadBoard(useRouterStore().boardId);
const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
updateMe();
updateBoards();
