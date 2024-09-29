import { initISS, interfaceStateStore } from './stores/interfaceStateStore.js';

import { setApiUrl } from './apiHelper.js';

fetch('/apiUrl')
  .then((resp) => {
    resp
      .text()
      .then((res) => {
        setApiUrl(res);
        console.log(`API url: ${res}`);
        initISS();
        interfaceStateStore?.updateRegAndApp();
      })
      .catch(() => {
        console.log('Не получается получить apiUrl');
      });
  })
  .catch(() => {
    alert('Не получается получить apiUrl');
  });
