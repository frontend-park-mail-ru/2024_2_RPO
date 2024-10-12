import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { HomePage } from './screens/HomePage';
import { IComponentFunction } from './jsxCore/types';

const App: IComponentFunction = () => {
  return <HomePage key="main_app" />;
};

const appRoot = document.getElementById('app_root') as HTMLDivElement;
createApp(App, appRoot);
