import { initISS, interfaceStateStore } from '@/stores/interfaceStateStore';
import { setApiUrl } from '@/api/apiHelper';
import './index.scss';
import './fonts.scss';

setApiUrl('http://localhost:8800'); //TODO вынести из хардкода
initISS();
interfaceStateStore?.updateRegAndApp();
