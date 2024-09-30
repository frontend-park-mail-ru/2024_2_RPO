import { loginUser } from '/api/users.js';
import { ModalDialog } from '/components/ModalDialog.js';
import {
  getHomePageISS,
  interfaceStateStore,
} from '/stores/interfaceStateStore.js';
import { AppState } from '/types/appState.js';
import { getInputElementById } from '/utils/domHelper';

export const LoginDialog = () => {
  return ModalDialog({
    title: 'Добро пожаловать в Pumpkin!',
    content: (
      <div>
        <form id="reg_data">
          <div class="form-field">
            <label for="nickname">Email:</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="Ваш email"
            />
          </div>
          <div class="form-field">
            <label for="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Самый надежный пароль"
            />
          </div>
        </form>
        <button
          class="submit-btn"
          ON_click={() => {
            const nicknameElem = getInputElementById('nickname');
            const passwordElem = getInputElementById('password');

            let failFlag = false;

            const nickname = nicknameElem.value;
            const password = passwordElem.value;

            if (!nickname) {
              failFlag = true;
              nicknameElem.style.borderColor = 'red';
            } else {
              nicknameElem.style.borderColor = 'gray';
            }
            passwordElem.style.borderColor = 'gray';

            if (!failFlag) {
              // Если валидация прошла, отправляем данные на сервер
              loginUser(nickname, password).then(
                () => {
                  if (typeof interfaceStateStore !== 'undefined') {
                    interfaceStateStore.mode = 'app';
                    interfaceStateStore.state = new AppState();
                    interfaceStateStore.updateRegAndApp();
                  }
                },
                (reason) => {
                  passwordElem.setCustomValidity(reason);
                  passwordElem.reportValidity();
                  nicknameElem.style.borderColor = 'red';
                  passwordElem.style.borderColor = 'red';
                }
              );
            }
          }}
        >
          Войти!
        </button>
      </div>
    ),
    closeCallback: () => {
      getHomePageISS().isLoginDialogOpened = false;
      interfaceStateStore?.update();
    },
  });
};
