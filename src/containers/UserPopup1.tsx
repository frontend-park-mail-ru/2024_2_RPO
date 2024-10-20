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
export const UserPopup = (props: UserPopupProps) => {
  return (
    <UserPopup key="user_popup" isOpened={true}>
      <div class="user-popup">
        <div class="user-popup__container">
          <tbody>
            <tr>
              <td rowspan="2">
                <img
                  src="static/img/avatar.svg"
                  alt="Profile Image"
                  class="popup-image"
                />
              </td>
              <td>@KarlMarkssss</td>
            </tr>
            <tr>
              <td>kmarx@mail.ru</td>
            </tr>
          </tbody>
          <tbody>
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
          </tbody>
        </div>
      </div>
    </UserPopup>
  );
};
