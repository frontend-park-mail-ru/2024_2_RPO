import { createApp } from './jsxCore/core';

const mainDiv = document.getElementById('app_root');
if (mainDiv !== undefined) {
  createApp(() => {
    return (
      <>
        <div>Кто прочитал</div>
        <div>Тот проиграл</div>
      </>
    );
  }, mainDiv);
} else {
  alert('App root is undefined');
}
