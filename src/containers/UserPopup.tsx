import { ComponentProps } from '@/jsxCore/types';
import {
  setModalDialogsStore,
  useModalDialogsStore,
} from '@/stores/modalDialogsStore';

interface PopupButtonProps extends ComponentProps {
  icon: string;
  title: string;
  callback: (event: Event) => void;
}

const PopupButton = (props: PopupButtonProps) => {
  return (
    <div
      class="popup__button"
      ON_click={(event: any) => {
        props.callback(event as Event);
      }}
    >
      <div class="popup__button-icon">
        <i className={props.icon}></i>
      </div>
      <div class="popup__button-text">{props.title}</div>
    </div>
  );
};

interface UserPopupProps extends ComponentProps {
  closeCallback: (event: Event) => void;
  isOpened: boolean;
}
/**
 * Компонент модального диалога
 * @param props Пропсы модального диалога
 * @returns JSX модального диалога
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
              class="popup-image"
            />
          </div>
          <div class="user-popup__info">
            <div class="user-popup__info">@KarlMarkssss</div>

            <div class="user-popup__info">kmarx@mail.ru</div>
          </div>
        </div>

        <div class="popup__button">
          <div class="popup__button-icon">
            <i class="bi bi-info-circle"></i>
          </div>

          <div class="popup__button-text">Помощь (ссылка на GH)</div>
        </div>

        <div class="popup__button">
          <div class="popup__button-icon">
            <i class="bi bi bi-rocket-takeoff"></i>
          </div>

          <div class="popup__button-text">Улучшить аккаунт</div>
        </div>

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

        <div class="popup__button">
          <div class="popup__button-icon">
            <i class="bi-box-arrow-right"></i>
          </div>

          <div class="popup__button-text">Выйти</div>
        </div>
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
