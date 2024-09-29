import { ButtonComponent } from '/components/Button.js';
import { ModalDialog } from '/components/ModalDialog.js';
import {
  getLandingISS,
  interfaceStateStore,
} from '/stores/interfaceStateStore.js';

export const Landing = () => {
  return (
    <>
      <div class="background">
        <i class="bi bi-kanban icon1"></i>
        <i class="bi bi-kanban icon2"></i>
      </div>
      <div class="landing_contents">
        <img src="/static/logo.svg" class="logo_image" />
        <h1 class="landing_title">Pumpkin</h1>
        <span style="margin-bottom: 30px">Облачный канбан со сверхспособностями</span>

        {ButtonComponent({
          text: 'Зарегистрироваться',
          callback: () => {
            getLandingISS().isRegistrationDialogOpened = true;
            interfaceStateStore?.update();
          },
        })}
        {ButtonComponent({
          text: 'Войти',
          callback: () => {
            getLandingISS().isLoginDialogOpened = true;
            interfaceStateStore?.update();
          },
        })}
      </div>

      {getLandingISS().isRegistrationDialogOpened
        ? ModalDialog({
            title: 'Добро пожаловать в Pumpkin!',
            content: (
              <form>
                <div class="form-field">
                  <label for="nickname">Никнейм:</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    placeholder="Ваш никнейм"
                  />
                </div>
                <div class="form-field">
                  <label for="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div class="form-field">
                  <label for="password">Пароль:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Самый надежный пароль"
                  />
                </div>
                <div class="form-field">
                  <label for="confirm-password">Повторите пароль:</label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Самый надежный пароль"
                  />
                </div>
                <div class="form-field">
                  <label for="description">Описание пользователя:</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Расскажите о себе"
                  ></textarea>
                </div>
                <button type="submit" class="submit-btn">
                  Зарегистрироваться!
                </button>
              </form>
            ),
            closeCallback: () => {
              getLandingISS().isRegistrationDialogOpened = false;
              interfaceStateStore?.update();
            },
          })
        : undefined}
    </>
  );
};
