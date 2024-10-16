import { Button } from '@/components/Button';
import { interfaceStateStore } from '@/stores/interfaceStateStore';
import { logout } from '@/api/users';
import { ModeSelect } from '@/components/ModeSelect';
import { ComponentProps } from '@/jsxCore/types';
import { EditableText } from '@/components/EditableText';

interface NavBarProps extends ComponentProps {
  leftPanelOpened: boolean;
  setLeftPanelOpened: (state: boolean) => void;
}

export const NavBar = (props: NavBarProps) => {
  return (
    <nav class="navbar">
      <div class="navbar__logo">
        <div
          class="navbar__left-panel-button"
          ON_click={() => {
            props.setLeftPanelOpened(!props.leftPanelOpened);
          }}
        >
          <i
            class={props.leftPanelOpened ? 'bi-x-lg' : 'bi-list'}
            style="font-size: 22px"
          ></i>
        </div>
        <a class="logo__link" href="/">
          <div class="logo">
            <img
              draggable="false"
              src="/static/img/logo.svg"
              alt="Logo"
              style="margin-bottom: 8px;"
            />
            <div draggable="false" class="navbar__logo__pumpkin">
              Pumpkin
            </div>
          </div>
        </a>
      </div>
      <div class="navbar__rest navbar__group">
        <div class="borderNameWithGear">
          <ModeSelect key="mode_select" currentMode="kanban" />
          <EditableText
            key="board_name_text"
            text="Моя доска"
            textClassName='navbar__board-name'
            wrapperClassName='navbar__board-name-wrapper'
            setText={(a) => {
              console.log(a);
            }}
          />
          <Button key="settings" icon="bi-gear" />
        </div>
        <div class="flex-grow"></div>
        <div class="navbar__group">
          <input
            class="search-input"
            type="text"
            placeholder="Поиск"
            style="padding-left: 36px"
          />
          <i
            class="search-input__search-icon bi-search"
            style="position: absolute;"
          ></i>
          <Button key="notification_btn" icon="bi-bell" />
          <Button
            key="logout_btn"
            icon="bi-box-arrow-right"
            callback={() => {
              logout();
            }}
          />
          {interfaceStateStore?.me?.name}
          <div class="profilePicture">
            <img
              draggable="false"
              src="/static/img/avatar.svg"
              alt="ProfilePicture"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
