import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';
import {
  setModalDialogsStore,
  useModalDialogsStore,
} from '@/stores/modalDialogsStore';

type UserProfileProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserProfile = (props: UserProfileProps) => {
  return (
    <ModalDialog
      key="Modal"
      isOpened={true}
      title="Настройки аккаунта"
      closeCallback={() => {
        const modalDialogsStore = useModalDialogsStore();
        modalDialogsStore.isUserProfileOpened = false;
        setModalDialogsStore(modalDialogsStore);
      }}
    >
      <div class="user-profile">
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

          <Button key="change_passwd" text="Изменить пароль" icon="bi-floppy" />
          <Button
            key="discard_btn"
            icon="bi-trash"
            text="Удалить аккаунт"
            variant="negative"
          />
        </div>
        <div class="user-profile__main">
          <div class="user-profile__change-data-section">
            <div class="user-profile__change-data-section-field">
              <div class="user-profile__change-data-section-label">Никнейм</div>
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
            <Button key="save_btn" text="Сохранить" icon="bi-floppy" />
            <Button key="no_save_btn" text="Отменить" icon="bi-x-lg" />
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
