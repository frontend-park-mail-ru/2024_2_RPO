import { getApiUrl } from '../api/apiHelper.js';
import { ModalDialog } from '/components/ModalDialog.js';
import {
  getHomePageISS,
  interfaceStateStore,
} from '/stores/interfaceStateStore.js';
import { AppState } from '/types/appState.js';

export const RegistrationDialog = () => {
  return ModalDialog({
    title: 'Добро пожаловать в Pumpkin!',
    content: (
      <div>
        <form id="reg_data">
          <div class="form-field">
            <label for="nickname">Никнейм:</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="Ваш никнейм"
            />
          </div>
          <div class="form-field">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Email" />
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
          <div class="form-field">
            <label for="confirm-password">Повторите пароль:</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
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
            const emailElem = document.getElementById(
              'email'
            ) as HTMLInputElement;
            const passwordElem = document.getElementById(
              'password'
            ) as HTMLInputElement;
            const confirmPasswordElem = document.getElementById(
              'confirm-password'
            ) as HTMLInputElement;

            let failFlag = false;

            const nickname = nicknameElem.value;
            const email = emailElem.value;
            const password = passwordElem.value;
            const confirmPassword = confirmPasswordElem.value;

            if (!nickname) {
              failFlag = true;
              nicknameElem.style.borderColor = 'red';
            } else {
              nicknameElem.style.borderColor = 'gray';
            }

            if (
              !email ||
              !email.match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
            ) {
              failFlag = true;
              emailElem.style.borderColor = 'red';
            } else {
              emailElem.style.borderColor = 'gray';
            }

            if (!password || password.length < 8) {
              failFlag = true;

              passwordElem.style.borderColor = 'red';
            } else {
              passwordElem.style.borderColor = 'gray';
            }

            if (password !== confirmPassword) {
              failFlag = true;
              confirmPasswordElem.style.borderColor = 'red';
            } else {
              confirmPasswordElem.style.borderColor = 'gray';
            }
            if (!failFlag) {
              // Если валидация прошла, отправляем данные на сервер
              fetch(getApiUrl('/auth/register'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name: nickname, email, password }),
              })
                .then((res) => {
                  if (res.status !== 200) {
                    alert('Логин или email заняты, попробуйте другие креды');
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
          Зарегистрироваться!
        </button>
      </div>
    ),
    closeCallback: () => {
      getHomePageISS().isRegistrationDialogOpened = false;
      interfaceStateStore?.update();
    },
  });
};
