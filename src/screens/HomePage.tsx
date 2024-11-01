import { Button } from '@/components/Button';
import { LoginDialog } from '@/containers/LoginDialog';
import { RegistrationDialog } from '@/containers/RegistrationDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';

type HomePageProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HomePage = (props: HomePageProps) => {
  const [isRegistrationOpened, setIsRegistrationOpened] = useState(false);
  const [isLoginOpened, setIsLoginOpened] = useState(false);

  return (
    <>
      <div class="home-page-bg">
        <i class="bi-kanban home-page-bg__icon1"></i>
        <i class="bi-kanban home-page-bg__icon2"></i>
      </div>
      <div class="homepage">
        <img src="static/img/logo.svg" class="home-page__logo" />
        <h1 class="homepage__pumpkin">Pumpkin</h1>
        <span style="margin-bottom: 30px">
          Облачный канбан со сверхспособностями
        </span>

        {Button({
          key: 'dfdsff',
          text: 'Зарегистрироваться',
          callback: () => {
            setIsRegistrationOpened(true);
          },
        })}

        <Button
          key="LoginButton"
          text="Войти"
          callback={() => {
            setIsLoginOpened(true);
          }}
        />
      </div>

      {isRegistrationOpened ? (
        <RegistrationDialog
          key="reg_dialog"
          closeCallback={() => {
            setIsRegistrationOpened(false);
          }}
        />
      ) : undefined}
      {isLoginOpened ? (
        <LoginDialog
          key="login_dialog"
          closeCallback={() => {
            setIsLoginOpened(false);
          }}
        />
      ) : undefined}
    </>
  );
};
