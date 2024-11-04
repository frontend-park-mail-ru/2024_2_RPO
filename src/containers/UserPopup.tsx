import { logout } from '@/api/users';
import { ComponentProps } from '@/jsxCore/types';
import { updateMe, useMeStore } from '@/stores/meStore';
import { openUserProfileModalDialog } from '@/stores/modalDialogsStore';
import { goToUrl } from '@/stores/routerStore';
import { User } from '@/types/user';

interface PopupButtonProps extends ComponentProps {
  icon: string;
  title: string;
  callback?: (event: Event) => void;
}

const PopupButton = (props: PopupButtonProps) => {
  return (
    <div
      class="user-popup__button"
      ON_click={(event: any) => {
        if (props.callback !== undefined) {
          props.callback(event as Event);
        }
      }}
    >
      <div class="user-popup__button-icon">
        <i className={props.icon}></i>
      </div>
      <div class="user-popup__button-text">{props.title}</div>
    </div>
  );
};

interface UserPopupProps extends ComponentProps {
  closeCallback: (event: Event) => void;
}
/**
 * Компонент попапа, который всплывает при нажатии на аватарку текущего пользователя на навбаре.
 */

export const UserPopup = (props: UserPopupProps) => {
  const me = useMeStore() as User;
  return (
    <>
      <div class="user-popup">
        <div class="user-popup__profile-info">
          <div>
            <img
              src={me.avatarImageUrl}
              alt="Profile Image"
              class="user-popup__avatar"
            />
          </div>
          <div class="user-popup__info">
            <div class="user-popup__nickname">@{me.name}</div>

            <div class="user-popup__info">{me.email}</div>
          </div>
        </div>

        <PopupButton key="help_btn" title="Помощь" icon="bi-info-circle" />

        <PopupButton
          key="account_upgrade_btn"
          title="Улучшить аккаунт"
          icon="bi-rocket-takeoff"
        />

        <PopupButton
          key="account_settings_btn"
          title="Настройки аккаунта"
          icon="bi-gear"
          callback={(event) => {
            props.closeCallback(event);
            openUserProfileModalDialog();
          }}
        />
        <PopupButton
          key="logout_btn"
          title="Выйти"
          icon="bi-box-arrow-right"
          callback={() => {
            logout().then(() => {
              goToUrl('/');
              updateMe();
            });
          }}
        />
      </div>
      <div
        class="full-screen-dark"
        ON_click={(event: PointerEvent) => {
          if (props.closeCallback !== undefined) {
            props.closeCallback(event);
          }
        }}
      ></div>
    </>
  );
};
