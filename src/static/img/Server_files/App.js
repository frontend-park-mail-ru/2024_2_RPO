import { initISS, interfaceStateStore } from './stores/interfaceStateStore.js';
import { setApiUrl } from './apiHelper.js';
fetch('/apiUrl')
    .then(function (resp) {
    resp
        .text()
        .then(function (res) {
        setApiUrl(res);
        console.log("API url: ".concat(res));
        initISS();
        interfaceStateStore === null || interfaceStateStore === void 0 ? void 0 : interfaceStateStore.updateRegAndApp();
    })
        .catch(function () {
        console.log('Не получается получить apiUrl');
    });
})
    .catch(function () {
    alert('Не получается получить apiUrl');
});
