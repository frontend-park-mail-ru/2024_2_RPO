import { initISS, interfaceStateStore } from './stores/interfaceStateStore.js';

import { setApiUrl } from './apiHelper.js';

setApiUrl('localhost:8800'); //TODO вынести из хардкода
initISS();
interfaceStateStore?.updateRegAndApp();
