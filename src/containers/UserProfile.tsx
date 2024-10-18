import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';

type UserProfileProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserProfile = (props: UserProfileProps) => {
  return (
    <ModalDialog key="Modal" isOpened={true}>
      <div class="modal">
        <div class="modal-content">
          <div class="profile-column">
            <div class="profile-image-container">
              <img
                src="static/img/avatar.svg"
                alt="Profile Image"
                class="profile-image"
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
            </div>
          </div>
          <div class="info-column">
            {/* <Button
              key="copy-token"
              text="Скопировать токен"
              icon="bi-link-45deg"
              // onclick="copyToken()"
            />
            <p class="subscription-id" id="user-token">
              @123456
            </p> */}

            <form id="nickname">
              <div class="form-field">
                <label for="nickname">Никнейм </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="KarlMarks"
                />
              </div>
              <div class="form-field">
                <label for="email">Email </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="karl.m@mail.ru"
                />
              </div>
            </form>
            <br />
            <br />
            <div>
              <tr>
                <td>
                  <Button
                    key="save_btn"
                    text="Сохранить"
                    icon="bi-floppy"
                    // onclick=""
                  />
                </td>
                <td> -</td>
                <td>
                  <Button
                    key="n0_save_btn"
                    text="Отменить"
                    icon="bi-x-lg"
                    // onclick=""
                  />
                </td>
              </tr>
            </div>
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
        <br />
        <Button key="discard_btn" icon="bi-trash" text="Удалить аккаунт" />
      </div>
    </ModalDialog>
  );
};
