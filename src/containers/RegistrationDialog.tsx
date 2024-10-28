import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ModalDialog } from '@/components/ModalDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { noop } from '@/utils/noop';

interface RegistrationDialogProps extends ComponentProps {
  closeCallback?: () => any;
}

export const RegistrationDialog = (props: RegistrationDialogProps) => {
  const [data, setData] = useState({
    login: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const validateEmail = (email: string) => {
    if (email === '') return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Введите корректный email';
  };

  const validatePasswordMatch = (password: string, repeatPassword: string) => {
    if (repeatPassword === '') return;
    return password === repeatPassword ? '' : 'Пароли не совпадают';
  };

  return (
    <ModalDialog
      key="modal_dialog"
      closeCallback={props.closeCallback}
      title="Добро пожаловать в Pumpkin!"
      isOpened={true}
    >
      <div className="login-form__wrapper">
        <div className="login-form">
          <div style="display: flex; justify-content: end">
            <label htmlFor="nickname">Логин:</label>
          </div>
          <Input
            key="nickname_input"
            onChanged={(newLogin) => {
              setData({ ...data, login: newLogin });
            }}
            validationMessage={(() => {
              if (data.login === '') {
                return;
              }
              if (data.login.length < 3 || data.login.length > 30) {
                return 'Логин должен быть от 3 до 30 символов';
              }
            })()}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="email">Email:</label>
          </div>
          <Input
            key="email_input"
            onChanged={(newEmail) => {
              setData({ ...data, email: newEmail });
            }}
            validationMessage={validateEmail(data.email)}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="password">Пароль:</label>
          </div>
          <Input
            key="password_input"
            onChanged={(newPassword) => {
              setData({ ...data, password: newPassword });
            }}
            validationMessage={(() => {
              if (data.password === '') {
                return;
              }
              if (data.password.length < 8) {
                return 'Пароль должен быть не менее 8 символов';
              }
            })()}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="repeat_password">Повторите пароль:</label>
          </div>
          <Input
            key="repeat_password_input"
            onChanged={(newRepeatPassword) => {
              setData({ ...data, repeatPassword: newRepeatPassword });
            }}
            validationMessage={validatePasswordMatch(
              data.password,
              data.repeatPassword
            )}
          />
        </div>
        <div className="login-form__button-container">
          <Button
            key="submit_btn"
            variant="positive"
            callback={noop}
            text="Войти!"
          />
        </div>
      </div>
    </ModalDialog>
  );
};
