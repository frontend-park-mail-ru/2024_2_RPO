import { ComponentProps, JsxNode } from '@/jsxCore/types';

interface UserPopupProps extends ComponentProps {
  children?: JsxNode;
  closeCallback?: () => void;
  isOpened: boolean;
}

/**
 * Компонент модального диалога
 * @param props Пропсы модального диалога
 * @returns JSX модального диалога
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserPopup1 = (props: UserPopupProps) => {
  return (
    <>
      <div class="user-popup">
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
        <div>
          <tr>
            <td>
              <div class="icon_cell">
                <i class="bi bi-info-circle"></i>
              </div>
            </td>
            <td>Помощь (ссылка на GH)</td>
          </tr>
          <tr>
            <td>
              <i class="bi bi-rocket-takeoff"></i>
            </td>
            <td>Улучшить аккаунт</td>
          </tr>
          <tr>
            <td>
              <i class="bi bi-gear"></i>
            </td>
            <td>Настройки аккаунта</td>
          </tr>
          <tr>
            <td>
              <i class="bi bi-box-arrow-right"></i>
            </td>
            <td>Выйти</td>
          </tr>
        </div>
      </div>
      <div class="user-popup__wrapper"></div>
    </>
  );
};
