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
            <button class="copy-token-btn" onclick="copyToken()">
              Скопировать токен
              <i class="bi-link-45deg"></i>
            </button>
            <p class="subscription-id" id="user-token">
              @123456
            </p>
            <h2 class="username">
              Карл Маркс <i class="bi-pencil"></i>
            </h2>
            <p class="email">
              email: karl.marks@mail.ru <i class="bi-pencil"></i>
            </p>
            <p class="subscription-type">
              Тип подписки: <span>Премиум</span>
              <i class="bi-star"></i>
              <button class="upgrade-btn">Upgrade!</button>
            </p>
          </div>
        </div>
        <button class="save-btn">
          Сохранить <i class="bi-floppy"></i>
        </button>
        <button class="logout-btn">
          <i class="bi-box-arrow-right"></i>
        </button>
      </div>
    </ModalDialog>
  );
};
