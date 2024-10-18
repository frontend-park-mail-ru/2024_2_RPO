import { logout } from '@/api/users';
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

              <Button key="upload-button" icon="bi-images" />
            </div>
          </div>
          <div class="info-column">
            <Button
              key="copy-token"
              text="Скопировать токен"
              icon="bi-link-45deg"
              // onclick="copyToken()"
            />
            <p class="subscription-id" id="user-token">
              @123456
            </p>
            <p>
              <h2 class="username">Карл Маркс</h2>
              <Button key="edit_username" icon="bi-pencil" />
            </p>
            <p class="email">
              email: karl.marks@mail.ru
              <Button key="edit_email" icon="bi-pencil" />
            </p>
            <p class="subscription-type">
              Тип подписки: <span>Премиум</span>
              <Button
                key="upgrade_subscription"
                text="Upgrade!"
                icon="bi-star"
                // onclick=""
              />
            </p>
          </div>
        </div>

        <Button
          key="save-btn"
          text="Сохранить"
          icon="bi-floppy"
          // onclick=""
        />

        <Button
          key="logout_btn"
          icon="bi-box-arrow-right"
          callback={() => {
            logout();
          }}
        />
      </div>
    </ModalDialog>
  );
};
