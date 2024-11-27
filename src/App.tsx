import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { MainApp } from './screens/MainApp';
import { setRouterStore, useRouterStore } from './stores/routerStore';
import { ToastContainer } from './containers/ToastContainer';
import { updateMe } from './stores/meStore';
import { getFlagRoutes } from './routes/routesFlag';
import { CsatPoll } from './screens/CsatPoll';
import { CsatResults } from './screens/CsatResults';
import { setCsatStore } from './stores/csatStore';

const App: IComponentFunction = () => {
  const routerStore = useRouterStore();

  return (
    <>
      <div class="display-none"></div>
      {routerStore.isApp && <MainApp key="main_app" />}
      {routerStore.isHome && <HomePage key="home_page" />}
      {routerStore.isPoll && <CsatPoll key="csat_poll" />}
      {routerStore.isCsatResults && <CsatResults key="csat_results" />}
      <ToastContainer key="toast_container" />
    </>
  );
};

const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
updateMe();

setTimeout(() => {
  setRouterStore(getFlagRoutes(window.location.pathname));
}, 0);

window.addEventListener('message', (ev: MessageEvent<string>) => {
  if (ev.data === 'close_csat') {
    console.log('should output');
    setCsatStore({ isOpened: false, questions: [] });
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(
      function (registration) {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        );
      },
      function (err) {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
} else {
  console.error('Service Worker is not available');
}

// const REFETCH_DELAY = 5000;

// setInterval(() => {
//   const activeBoard = useActiveBoardStore();
//   if (activeBoard !== undefined) {
//     loadBoard(activeBoard.id, true);
//   }
// }, REFETCH_DELAY);
