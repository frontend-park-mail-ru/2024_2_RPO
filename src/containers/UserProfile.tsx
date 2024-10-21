import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';

type UserProfileProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserProfile = (props: UserProfileProps) => {
  return (
    <ModalDialog key="Modal" isOpened={true} title="Настройки аккаунта">
      <div class="modal">
        <div class="modal-content">
          <div class="user-profile__aside ">
            <img
              src="static/img/KarlMarks.jpg"
              alt="Profile Image"
              class="user-profile__avatar"
            />

            <Button
              key="change_avatar"
              text="Сменить аватарку"
              icon="bi-images"
            />

            <Button
              key="change_passwd"
              text="Изменить пароль"
              icon="bi-floppy"
            />
            <br />
            <Button
              key="discard_btn"
              icon="bi-trash"
              text="Удалить аккаунт"
              variant="accent"
            />
          </div>
          <div class="user-profile__main">
            <div class="user-profile__change-data-section">
              <div class="user-profile__change-data-section-field">
                <div class="user-profile__change-data-section-label">
                  Никнейм
                </div>
                <div class="user-profile__change-data-section-form">
                  <form id="nickname">
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      placeholder="KarlMarks"
                    />
                  </form>
                </div>
              </div>
              <div class="user-profile__change-data-section-field">
                <div class="user-profile__change-data-section-label">Email</div>
                <div class="user-profile__change-data-section-form">
                  <form id="nickname">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="karl.m@mail.ru"
                    />
                  </form>
                </div>
              </div>
            </div>
            <div class="user-profile__save-data-section">
              <Button
                key="save_btn"
                text="Сохранить"
                icon="bi-floppy"
                // onclick=""
              />

              <Button
                key="no_save_btn"
                text="Отменить"
                icon="bi-x-lg"
                // onclick=""
              />
            </div>
          </div>

          {/* <Button
              key="copy-token"
              text="Скопировать токен"
              icon="bi-link-45deg"
              // onclick="copyToken()"
            />
            <p class="subscription-id" id="user-token">
              @123456
            </p> */}

          {/* <p class="subscription-type">
              Тип подписки: <span>Премиум</span>
              <Button
                key="upgrade_subscription"
                text="Upgrade!"
                icon="bi-star"
                // onclick=""
              />
            </p> */}
        </div>
      </div>
    </ModalDialog>
  );
};
