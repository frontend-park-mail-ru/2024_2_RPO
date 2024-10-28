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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState({
    login: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  console.log(data);
  return (
    <ModalDialog
      key="modal_dialog"
      closeCallback={props.closeCallback}
      title="Добро пожаловать в Pumpkin!"
      isOpened={true}
    >
      <div className="login-form__wrapper">
        <div class="login-form">
          <div style="display: flex; justify-content: end">
            <label for="nickname">Логин:</label>
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
            <label for="nickname">Email:</label>
          </div>
          <Input
            key="email_input"
            onChanged={(newEmail) => {
              setData({ ...data, email: newEmail });
            }}
          />
          <div style="display: flex; justify-content: end">
            <label for="nickname">Пароль:</label>
          </div>
          <Input
            key="password_input"
            onChanged={(newPassword) => {
              setData({ ...data, password: newPassword });
            }}
          />
          <div style="display: flex; justify-content: end">
            <label for="password">Повторите пароль:</label>
          </div>
          <Input
            key="repeat_password_input"
            onChanged={(newRepeatPassword) => {
              setData({ ...data, repeatPassword: newRepeatPassword });
            }}
          />
        </div>
        <div class="login-form__button-container">
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
