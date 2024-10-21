import { ComponentProps, JsxNode } from '@/jsxCore/types';

interface UserPopupProps extends ComponentProps {
  children?: JsxNode;
  closeCallback?: (event: PointerEvent) => void;
  isOpened: boolean;
}

/**
 * Компонент модального диалога
 * @param props Пропсы модального диалога
 * @returns JSX модального диалога
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        <div class="popup__button">
          <div class="popup__button-icon">
            <i class="bi bi-gear"></i>
          </div>

          <div class="popup__button-text">Настройки аккаунта</div>
        </div>

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
