import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { setUseMocks } from './api/apiHelper';
import { MainApp } from './screens/MainApp';

const App: IComponentFunction = () => {
  return (
    <>
      {
        // eslint-disable-next-line no-constant-condition
        false ? <HomePage key="home_page" /> : undefined
      }
      {
        // eslint-disable-next-line no-constant-condition
        true ? <MainApp key="main_app" /> : undefined
      }
    </>
  );
};

setUseMocks(true);

const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
