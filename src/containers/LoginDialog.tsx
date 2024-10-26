import { loginUser } from '@/api/users';
import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';
import { getInputElementById } from '@/utils/domHelper';

interface LoginDialogProps extends ComponentProps {
  closeCallback?: () => any;
}

export const LoginDialog = (props: LoginDialogProps) => {
  return (
    <ModalDialog
      key="login_dialog"
      closeCallback={props.closeCallback}
      isOpened={true}
    >
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
                  //TODO бизнес-логика
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
    </ModalDialog>
  );
};
