import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { setUseMocks } from './api/apiHelper';
import { MainApp } from './screens/MainApp';
import { loadBoard } from './stores/activeBoardStore';
import { useRouterStore } from './stores/routerStore';

const App: IComponentFunction = () => {
  const routerStore = useRouterStore();
  console.log('Router store: ', routerStore);
  return (
    <>
      {routerStore.isApp ? (
        <MainApp key="main_app" />
      ) : (
        <HomePage key="home_page" />
      )}
    </>
  );
};

setUseMocks(true);

const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
loadBoard(2);
