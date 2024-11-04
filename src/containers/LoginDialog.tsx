import { loginUser } from '@/api/users';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ModalDialog } from '@/components/ModalDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { updateMe } from '@/stores/meStore';
import { goToUrl } from '@/stores/routerStore';
import { showToast } from '@/stores/toastNotificationStore';

interface LoginDialogProps extends ComponentProps {
  closeCallback?: () => any;
}

export const LoginDialog = (props: LoginDialogProps) => {
  const [data, setData] = useState({ email: '', password: '' });
  console.log(data);
  const submitFunction = () => {
    loginUser(data.email, data.password).then((ok) => {
      if (ok) {
        updateMe();
        goToUrl('/app');
      } else {
        showToast('Ошибка при входе', 'error');
      }
    });
  };
  return (
    <ModalDialog
      key="login_dialog"
      title="Вход"
      closeCallback={props.closeCallback}
      isOpened={true}
    >
      <div class="login-form">
        <label for="email">Email:</label>
        <Input
          key="email_input"
          onEnter={submitFunction}
          onChanged={(newValue) => {
            data.email = newValue;
            setData(data);
          }}
        />
        <label for="password">Пароль:</label>
        <Input
          key="password_input"
          isPassword
          onEnter={submitFunction}
          onChanged={(newValue) => {
            data.password = newValue;
            setData(data);
          }}
        />
      </div>
      <div class="login-form__button-container">
        <Button
          key="submit_btn"
          variant="positive"
          callback={submitFunction}
          text="Войти!"
        />
      </div>
    </ModalDialog>
  );
};
