import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { setApiUrl } from './api/apiHelper';
import { MainApp } from './screens/MainApp';
import { setRouterStore, useRouterStore } from './stores/routerStore';
import { ToastContainer } from './containers/ToastContainer';
import { apiUrl } from './config';
import { updateMe } from './stores/meStore';
import { getFlagRoutes } from './routes/routesFlag';

setApiUrl(apiUrl);

const App: IComponentFunction = () => {
  const routerStore = useRouterStore();

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

const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
updateMe();

setTimeout(() => {
  setRouterStore(getFlagRoutes(window.location.pathname));
}, 0);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/static/sw.js').then(
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
}
