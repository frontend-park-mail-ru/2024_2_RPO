import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';
import { noop } from '@/utils/noop';

interface RegistrationDialogProps extends ComponentProps {
  closeCallback?: () => any;
}

export const RegistrationDialog = (props: RegistrationDialogProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = {
    login: '',
    email: '',
    password: '',
    repeatPassword: '',
  };
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
          <Input key="nickname_input" />
          <div style="display: flex; justify-content: end">
            <label for="nickname">Email:</label>
          </div>
          <Input key="email_input" />
          <div style="display: flex; justify-content: end">
            <label for="nickname">Пароль:</label>
          </div>
          <Input key="password_input" />
          <div style="display: flex; justify-content: end">
            <label for="password">Повторите пароль:</label>
          </div>
          <Input key="repeat_password_input" />
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
