import { ButtonComponent } from '/components/Button.js';
import { LoginDialog } from '/containers/LoginDialog.js';
import { RegistrationDialog } from '/containers/RegistrationDialog.js';
import {
  getHomePageISS,
  interfaceStateStore,
} from '/stores/interfaceStateStore.js';

export const HomePage = () => {
  return (
    <>
      <div class="background">
        <i class="bi-kanban icon1"></i>
        <i class="bi-kanban icon2"></i>
      </div>
      <div class="landing_contents">
        <img src="/static/logo.svg" class="logo_image" />
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
