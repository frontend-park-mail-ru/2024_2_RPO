import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';
import { noop } from '@/utils/noop';

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
          callback={noop}
          text="Войти!"
        />
      </div>
    </ModalDialog>
  );
};
