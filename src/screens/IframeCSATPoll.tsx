import { createApp } from '@/jsxCore/core'; // Аналог ReactDOM для вашего фреймворка
import './CsatPoll.scss';
import { CSATPoll } from './CsatPoll';

// Компонент для встраивания в iframe
export const IframeCSATPoll = () => {
  return (
    <div class="iframe-wrapper">
      <div class="iframe-header">
        <button
          class="close-button"
          onclick={() => window.parent.postMessage('close-iframe', '*')}
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <CSATPoll />
    </div>
  );
};

// Подключаем компонент в DOM, как это делается для главной страницы
const appRoot = document.getElementById('iframe-root') as HTMLDivElement;
createApp(IframeCSATPoll, appRoot);
