import { Button } from '@/components/Button';
import { LoginDialog } from '@/containers/LoginDialog';
import { RegistrationDialog } from '@/containers/RegistrationDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { useMeStore } from '@/stores/meStore';
import { goToUrl } from '@/stores/routerStore';

type HomePageProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HomePage = (props: HomePageProps) => {
  const [isRegistrationOpened, setIsRegistrationOpened] = useState(false);
  const [isLoginOpened, setIsLoginOpened] = useState(false);
  const userMe = useMeStore();

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

        {userMe === undefined && (
          <Button
            key="reg_button"
            text="Зарегистрироваться"
            callback={() => {
              setIsRegistrationOpened(true);
            }}
          />
        )}

        {userMe === undefined && (
          <Button
            key="login_button"
            text="Войти"
            callback={() => {
              setIsLoginOpened(true);
            }}
          />
        )}
        {userMe !== undefined && (
          <Button
            key="login_button"
            text="Перейти в приложение"
            variant="positive"
            callback={() => {
              goToUrl('/app');
            }}
          />
        )}
      </div>

      {isRegistrationOpened && (
        <RegistrationDialog
          key="reg_dialog"
          closeCallback={() => {
            setIsRegistrationOpened(false);
          }}
        />
      )}
      {isLoginOpened && (
        <LoginDialog
          key="login_dialog"
          closeCallback={() => {
            setIsLoginOpened(false);
          }}
        />
      )}
    </>
  );
};
