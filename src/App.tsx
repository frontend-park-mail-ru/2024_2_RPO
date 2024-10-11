import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';
import { initISS } from './stores/interfaceStateStore';

const App: IComponentFunction = () => {
  return ['App', <HomePage key="main_app" />];
};

const appRoot = document.getElementById('app_root') as HTMLDivElement;
initISS();
createApp(App, appRoot);
