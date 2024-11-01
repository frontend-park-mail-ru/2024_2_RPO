import { registerUser } from '@/api/users';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ModalDialog } from '@/components/ModalDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { updateMe } from '@/stores/meStore';
import { goToUrl } from '@/stores/routerStore';
import { showToast } from '@/stores/toastNotificationStore';
import {
  validateEmail,
  validateNickname,
  validatePassword,
} from '@/utils/validation';

interface RegistrationDialogProps extends ComponentProps {
  closeCallback?: () => any;
}

export const RegistrationDialog = (props: RegistrationDialogProps) => {
  const [data, setData] = useState({
    nickname: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isEmailTaken, setIsEmailTaken] = useState(false);

  const validationData = {
    nickname: validateNickname(data.nickname),
    email: validateEmail(data.email),
    password: validatePassword(data.password),
    repeatPassword: {
      allowed: data.repeatPassword === data.password,
      validationMessage:
        data.repeatPassword !== data.password
          ? 'Пароли не совпадают'
          : undefined,
    },
  };
  const validationOk =
    validationData.nickname.allowed &&
    validationData.password.allowed &&
    validationData.email.allowed &&
    validationData.repeatPassword.allowed;

  if (isNicknameTaken) {
    validationData.nickname = {
      allowed: false,
      validationMessage: 'Никнейм занят',
    };
  }
  if (isEmailTaken) {
    validationData.email = {
      allowed: false,
      validationMessage: 'Email занят',
    };
  }

  const submitFunction = () => {
    if (!validationOk) {
      showToast('Ошибки в форме регистрации', 'error');
      return;
    }
    registerUser(data.nickname, data.email, data.password).then((response) => {
      switch (response) {
        case 'ok':
          showToast('Успешная регистрация', 'success');
          updateMe();
          goToUrl('/app');
          break;
        case 'email_busy':
          setIsEmailTaken(true);
          showToast('Email занят', 'warning');
          break;
        case 'login_busy':
          setIsNicknameTaken(true);
          showToast('Никнейм занят', 'warning');
          break;
        case 'login_and_email_busy':
          setIsNicknameTaken(true);
          setIsEmailTaken(true);
          showToast('Email и никнейм заняты', 'warning');
          break;
        default:
          showToast('Неизвестная ошибка', 'error');
      }
    });
  };

  return (
    <ModalDialog
      key="modal_dialog"
      closeCallback={props.closeCallback}
      title="Регистрация"
      isOpened={true}
    >
      <div className="login-form__wrapper">
        <div className="login-form">
          <div style="display: flex; justify-content: end">
            <label htmlFor="nickname">Никнейм:</label>
          </div>
          <Input
            key="nickname_input"
            onEnter={submitFunction}
            onChanged={(newNickname) => {
              setIsNicknameTaken(false);
              setData({ ...data, nickname: newNickname });
            }}
            validationMessage={validationData.nickname.validationMessage}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="email">Email:</label>
          </div>
          <Input
            key="email_input"
            onChanged={(newEmail) => {
              setIsEmailTaken(false);
              setData({ ...data, email: newEmail });
            }}
            onEnter={submitFunction}
            validationMessage={validationData.email.validationMessage}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="password">Пароль:</label>
          </div>
          <Input
            key="password_input"
            isPassword
            onEnter={submitFunction}
            onChanged={(newPassword) => {
              setData({ ...data, password: newPassword });
            }}
            validationMessage={validationData.password.validationMessage}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="repeat_password">Повторите пароль:</label>
          </div>
          <Input
            key="repeat_password_input"
            isPassword
            onEnter={submitFunction}
            onChanged={(newRepeatPassword) => {
              setData({ ...data, repeatPassword: newRepeatPassword });
            }}
            validationMessage={validationData.repeatPassword.validationMessage}
          />
        </div>
        <div className="login-form__button-container">
          <Button
            key="submit_btn"
            variant={validationOk ? 'positive' : 'default'}
            callback={submitFunction}
            text="Зарегистрироваться"
          />
        </div>
      </div>
    </ModalDialog>
  );
};
