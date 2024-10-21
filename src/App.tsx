import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { setUseMocks } from './api/apiHelper';
import { MainApp } from './screens/MainApp';
import { loadBoard } from './stores/activeBoardStore';

const isMainPage = true; // TODO убрать, это для дебага

const App: IComponentFunction = () => {
  return (
    <>
      {!isMainPage ? <HomePage key="home_page" /> : undefined}
      {isMainPage ? <MainApp key="main_app" /> : undefined}
    </>
  );
};

setUseMocks(true);

const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
// В routerStore разместить store, котоырй будет содержать href
// routerStore, который хранит currentRoute
// Действия: goTo, replace, goBack (в сторе для роутера)
// Компонент Router
// const routerStore = useStores()
// reouteStore.onRouteChange(() => {}); на смене роутера определяется, какая страница будет отрендерена
// Глобальный href, компонент роутера,
// Глобальная функция, меняющая href
loadBoard(2);
