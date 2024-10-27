import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { setUseMocks } from './api/apiHelper';
import { MainApp } from './screens/MainApp';
import { loadBoard } from './stores/activeBoardStore';
import { useRouterStore } from './stores/routerStore';

setUseMocks(true);

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
    </>
  );
};

const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
loadBoard(2);
