import { registerUser } from '/api/users.js';
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
              placeholder="Пароль"
            />
          </div>
          <div class="form-field">
            <label for="confirm-password">Повторите пароль:</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Пароль"
            />
          </div>
          <span id="allErrors"></span>
          <div style="height:50px;"></div>;
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

            const allErrors = document.getElementById(
              'allErrors'
            ) as HTMLSpanElement;
            allErrors.innerText = '';

            let failFlag = false;

            const MIN_PASSWD_LENGTH = 8;
            const MAX_LENGTH = 60;

            const nickname = nicknameElem.value;
            const email = emailElem.value;
            const password = passwordElem.value;
            const confirmPassword = confirmPasswordElem.value;

            if (!nickname) {
              failFlag = true;
              nicknameElem.style.borderColor = 'red';
              allErrors.innerText += 'Пустой ник\n';
            } else if (nickname.length > MAX_LENGTH) {
              failFlag = true;
              nicknameElem.style.borderColor = 'red';
              allErrors.innerText += 'Слишком длинное имя\n';
            } else {
              nicknameElem.style.borderColor = 'gray';
              nicknameElem.setCustomValidity('');
            }
            allErrors.style.color = 'red';

            const emailRegex =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!email) {
              failFlag = true;
              emailElem.style.borderColor = 'red';
              allErrors.innerText += 'Пустой email\n';
            } else if (!email.match(emailRegex)) {
              failFlag = true;
              emailElem.style.borderColor = 'red';
              allErrors.innerText += 'Инвалидный email\n';
            } else if (email.length > MAX_LENGTH) {
              failFlag = true;
              emailElem.style.borderColor = 'red';
              allErrors.innerText += 'Слишком длинный email\n';
            } else {
              emailElem.style.borderColor = 'gray';
            }

            if (!password || password.length < MIN_PASSWD_LENGTH) {
              failFlag = true;
              allErrors.innerText += 'Пароль должен быть не менее 8 символов\n';
              passwordElem.style.borderColor = 'red';
            } else if (password.length > MAX_LENGTH) {
              failFlag = true;
              allErrors.innerText +=
                'Слишком длинный пароль, bcrypt не сможет его хешировать\n';
              passwordElem.style.borderColor = 'red';
            } else {
              passwordElem.style.borderColor = 'gray';
              allErrors.innerText += '';
            }

            if (password !== confirmPassword) {
              failFlag = true;
              allErrors.innerText += 'Пароли должны совпадать\n';
              confirmPasswordElem.style.borderColor = 'red';
            } else {
              confirmPasswordElem.style.borderColor = 'gray';
            }
            if (!failFlag) {
              // Если валидация прошла, отправляем данные на сервер
              registerUser(nickname, email, password).then(
                () => {
                  if (typeof interfaceStateStore !== 'undefined') {
                    interfaceStateStore.mode = 'app';
                    interfaceStateStore.state = new AppState();
                    interfaceStateStore.updateRegAndApp();
                  }
                },
                (reason: string) => {
                  allErrors.innerText += reason + '\n';
                  allErrors.innerText +=
                    'Попробуйте другие email и логин взять';
                }
              );
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
