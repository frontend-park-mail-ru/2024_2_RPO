import { getApiUrl } from '../api/apiHelper.js';
import { ModalDialog } from '/components/ModalDialog.js';
import {
  getHomePageISS,
  interfaceStateStore,
} from '/stores/interfaceStateStore.js';
import { AppState } from '/types/appState.js';

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
            const nicknameElem = document.getElementById(
              'nickname'
            ) as HTMLInputElement;
            const passwordElem = document.getElementById(
              'password'
            ) as HTMLInputElement;

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
              fetch(getApiUrl('/auth/login'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email: nickname, password }),
              })
                .then((res) => {
                  if (res.status !== 200) {
                    nicknameElem.style.borderColor = 'red';
                    passwordElem.style.borderColor = 'red';
                  } else {
                    if (interfaceStateStore !== undefined) {
                      interfaceStateStore.mode = 'app';
                      interfaceStateStore.state = new AppState();
                    }
                    interfaceStateStore?.updateRegAndApp();
                  }
                })
                .catch(() => {
                  alert('Отвалился бэк, попробуйте перезагрузиться');
                });
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
