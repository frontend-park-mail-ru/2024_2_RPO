import { loginUser } from '@/api/users';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
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
      title="Вход"
      closeCallback={props.closeCallback}
      isOpened={true}
    >
      <div class="login-form">
        <label for="nickname">Email:</label>
        <Input key="nickname_input" />
        <label for="password">Пароль:</label>
        <Input key="password_input" />
      </div>
      <div class="login-form__button-container">
        <Button
          key="submit_btn"
          variant="positive"
          callback={wtf}
          text="Войти!"
        />
      </div>
    </ModalDialog>
  );
};

export const wtf = () => {
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
};
