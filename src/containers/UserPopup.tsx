import { ComponentProps } from '@/jsxCore/types';
import {
  setModalDialogsStore,
  useModalDialogsStore,
} from '@/stores/modalDialogsStore';

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
  isOpened: boolean;
}
/**
 * Компонент попапа, который всплывает при нажатии на аватарку текущего пользователя на навбаре.
 */

export const UserPopup = (props: UserPopupProps) => {
  return (
    <>
      <div className={'user-popup ' + (props.isOpened ? '' : 'display-none')}>
        <div class="user-popup__profile-info">
          <div class="user-popup__avatar">
            <img
              src="static/img/KarlMarks.jpg"
              alt="Profile Image"
              class="user-popup__avatar"
            />
          </div>
          <div class="user-popup__info">
            <div class="user-popup__nickname">@KarlMarkssss</div>

            <div class="user-popup__info">kmarx@mail.ru</div>
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
            const modalDialogsStore = useModalDialogsStore();
            modalDialogsStore.isUserProfileOpened = true;
            setModalDialogsStore(modalDialogsStore);
          }}
        />
        <PopupButton key="logout_btn" title="Выйти" icon="bi-box-arrow-right" />
      </div>
      <div
        className={
          'user-popup__wrapper ' + (props.isOpened ? '' : 'display-none')
        }
        ON_click={(event: PointerEvent) => {
          if (props.closeCallback !== undefined) {
            props.closeCallback(event);
          }
        }}
      ></div>
    </>
  );
};
