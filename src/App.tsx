import { initISS, interfaceStateStore } from '@/stores/interfaceStateStore';
import { setApiUrl } from '@/api/apiHelper';

setApiUrl('http://localhost:8800'); //TODO вынести из хардкода
initISS();
interfaceStateStore?.updateRegAndApp();
