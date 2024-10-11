import './index.scss';
import './fonts.scss';
import { createApp } from './jsxCore/core';
import { ComponentProps, IComponentFunction } from './jsxCore/types';
import { useState } from './jsxCore/hooks';

interface ButtonProps extends ComponentProps {
  label: string;
  onClick?: () => void;
}
const Button = (props: ButtonProps) => {
  const label = props.label;
  const onClick = props.onClick;
  return [
    'Button',
    <>
      <button ON_click={onClick}>test</button>
      <span style="min-width:20px"></span>
      {label}
    </>,
  ];
};

const App: IComponentFunction = () => {
  const [clicks, setClicks] = useState(0);
  const label = `Clicked ${clicks} times`;
  return [
    'App',
    <>
      My app
      <br></br>
      <Button
        key="btn1"
        label={label}
        onClick={() => {
          setClicks(clicks + 1);
        }}
      />
      <br></br>
      <div>
        <Button key="btn2" label={label} />
      </div>
    </>,
  ];
};

const appRoot = document.getElementById('app_root') as HTMLDivElement;

createApp(App, appRoot);
