import { ModalDialog } from '@/components/ModalDialog';

import { ComponentProps } from '@/jsxCore/types';

type UserPopupProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const UserPopup = (props: UserPopupProps) => {
  return (
    <ModalDialog key="user_popup" isOpened={true}>
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
    </ModalDialog>
  );
};
