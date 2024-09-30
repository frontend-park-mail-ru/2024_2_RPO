import { initISS, interfaceStateStore } from './stores/interfaceStateStore.js';

import { setApiUrl } from './api/apiHelper.js';

setApiUrl('http://localhost:8800'); //TODO вынести из хардкода
initISS();
interfaceStateStore?.updateRegAndApp();
