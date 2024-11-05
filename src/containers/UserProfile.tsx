import {
  changeUserPassword,
  updateUserAvatar,
  updateUserProfile,
} from '@/api/users';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ModalDialog } from '@/components/ModalDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { setMeStore, updateMe, useMeStore } from '@/stores/meStore';
import { closeUserProfileModalDialog } from '@/stores/modalDialogsStore';
import { showToast } from '@/stores/toastNotificationStore';
import { User } from '@/types/user';

type UserProfileProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserProfile = (props: UserProfileProps) => {
  const me = useMeStore() as User;
  const [newProfile, setNewProfile] = useState({
    nickname: me.name,
    email: me.email,
  });
  const [newPassword, setNewPassword] = useState({
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
  });
  const submitProfile = () => {
    updateUserProfile({
      name: newProfile.nickname,
      email: newProfile.email,
    })
      .then((newMe) => {
        me.email = newMe.email;
        me.name = newMe.name;
        setMeStore(me);
        showToast('Успешно изменены данные', 'success');
      })
      .catch(() => {
        showToast('Произошла ошибка', 'error');
      });
  };
  const submitPassword = () => {
    if (newPassword.oldPassword.length === 0) {
      showToast('Введите старый пароль', 'error');
      return;
    }
    if (newPassword.newPassword.length < 8) {
      showToast('Новый пароль должен быть больше 8 символов', 'error');
      return;
    }
    if (newPassword.newPassword.length > 50) {
      showToast('Новый пароль должен быть меньше 50 символов', 'error');
      return;
    }
    if (newPassword.newPassword !== newPassword.repeatPassword) {
      showToast('Пароли должны совпадать', 'error');
      return;
    }
    changeUserPassword(newPassword.oldPassword, newPassword.newPassword).then(
      () => {
        showToast('Успешно изменён пароль!', 'success');
      }
    );
  };
  return (
    <ModalDialog
      key="Modal"
      isOpened={true}
      title="Настройки аккаунта"
      closeCallback={closeUserProfileModalDialog}
    >
      <div class="user-profile">
        <div class="user-profile__aside ">
          <img
            src={me?.avatarImageUrl}
            alt="Profile Image"
            class="user-profile__avatar"
          />
          <input
            id="uploadavatar"
            type="file"
            style="display:none"
            ON_change={(event: InputEvent) => {
              const files = (event.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                updateUserAvatar(files[0]).then(() => {
                  showToast('Успешно обновлена аватарка', 'success');
                  updateMe();
                });
              }
            }}
          />
          <Button
            key="change_avatar"
            text="Сменить аватарку"
            icon="bi-images"
            callback={() => {
              const el = document.getElementById(
                'uploadavatar'
              ) as HTMLInputElement;
              el.click();
            }}
          />
        </div>
        <div class="user-profile__main">
          <div class="user-profile__change-data-section">
            <div class="user-profile__change-data-section-field">
              <div class="user-profile__change-data-section-label">Никнейм</div>
              <div class="user-profile__change-data-section-form">
                <Input
                  key="new_nickname"
                  initialValue={me.name}
                  onChanged={(newData) => {
                    newProfile.nickname = newData;
                    setNewProfile(newProfile);
                  }}
                  onEnter={submitProfile}
                />
              </div>
            </div>
            <div class="user-profile__change-data-section-field">
              <div class="user-profile__change-data-section-label">Email</div>
              <div class="user-profile__change-data-section-form">
                <Input
                  key="new_email"
                  initialValue={me.email}
                  onChanged={(newData) => {
                    newProfile.email = newData;
                    setNewProfile(newProfile);
                  }}
                  onEnter={submitProfile}
                />
              </div>
            </div>
          </div>
          <div class="user-profile__save-data-section">
            <Button
              key="save_profile_btn"
              text="Сохранить"
              icon="bi-floppy"
              variant="accent"
              callback={submitProfile}
            />
          </div>
          <div class="user-profile__change-data-section">
            <div class="user-profile__change-data-section-field">
              <div class="user-profile__change-data-section-label">
                Старый пароль
              </div>
              <div class="user-profile__change-data-section-form">
                <Input
                  key="old_password"
                  isPassword
                  onChanged={(newData) => {
                    newPassword.oldPassword = newData;
                    setNewPassword(newPassword);
                  }}
                  onEnter={submitPassword}
                />
              </div>
            </div>
            <div class="user-profile__change-data-section-field">
              <div class="user-profile__change-data-section-label">
                Новый пароль
              </div>
              <div class="user-profile__change-data-section-form">
                <Input
                  key="new_password"
                  isPassword
                  onChanged={(newData) => {
                    newPassword.newPassword = newData;
                    setNewPassword(newPassword);
                  }}
                  onEnter={submitPassword}
                />
              </div>
            </div>
            <div class="user-profile__change-data-section-field">
              <div class="user-profile__change-data-section-label">
                Повторите пароль
              </div>
              <div class="user-profile__change-data-section-form">
                <Input
                  key="repeat_password"
                  isPassword
                  onChanged={(newData) => {
                    newPassword.repeatPassword = newData;
                    setNewPassword(newPassword);
                  }}
                  onEnter={submitPassword}
                />
              </div>
            </div>
            <div class="user-profile__save-data-section">
              <Button
                key="change_password_btn"
                text="Сменить пароль"
                icon="bi-key"
                variant="accent"
                callback={submitPassword}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
