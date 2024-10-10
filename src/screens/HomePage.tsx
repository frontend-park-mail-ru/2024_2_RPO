import { ButtonComponent } from '@/components/Button';
import { LoginDialog } from '@/containers/LoginDialog';
import { RegistrationDialog } from '@/containers/RegistrationDialog';
import {
  getHomePageISS,
  interfaceStateStore,
} from '@/stores/interfaceStateStore';

export const HomePage = () => {
  return (
    <>
      <div class="background">
        <i class="bi-kanban icon1"></i>
        <i class="bi-kanban icon2"></i>
      </div>
      <div class="landing_contents">
        <img src="static/img/logo.svg" class="logo_image" />
        <h1 class="homepage__pumpkin">Pumpkin</h1>
        <span style="margin-bottom: 30px">
          Облачный канбан со сверхспособностями
        </span>

        {ButtonComponent({
          text: 'Зарегистрироваться',
          callback: () => {
            getHomePageISS().isRegistrationDialogOpened = true;
            interfaceStateStore?.update();
          },
        })}
        {ButtonComponent({
          text: 'Войти',
          callback: () => {
            getHomePageISS().isLoginDialogOpened = true;
            interfaceStateStore?.update();
          },
        })}
      </div>

      {getHomePageISS().isRegistrationDialogOpened
        ? RegistrationDialog()
        : undefined}
      {getHomePageISS().isLoginDialogOpened ? LoginDialog() : undefined}
    </>
  );
};
