import { Button } from '@/components/Button';
import { interfaceStateStore } from '@/stores/interfaceStateStore';
import { logout } from '@/api/users';
import { ModeSelect } from '@/components/ModeSelect';
import { ComponentProps } from '@/jsxCore/types';
import { EditableText } from '@/components/EditableText';
import { useState } from '@/jsxCore/hooks';

interface NavBarProps extends ComponentProps {
  leftPanelOpened: boolean;
  setLeftPanelOpened: (state: boolean) => void;
}

export const NavBar = (props: NavBarProps) => {
  const [boardName, setBoardName] = useState('Моя доска');
  return (
    <nav class="navbar">
      <div class="navbar__logo-group">
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
        <a class="navbar__logo-link" href="/">
          <div class="navbar__logo-icon">
            <img
              draggable="false"
              src="/static/img/logo.svg"
              alt="Logo"
              style="margin-bottom: 8px;"
            />
            <div draggable="false" class="navbar__logo-link">
              Pumpkin
            </div>
          </div>
        </a>
      </div>
      <div class="navbar__rest navbar__group">
        <div class="navbar__group">
          <ModeSelect key="mode_select" currentMode="kanban" />
          <EditableText
            key="board_name_text"
            text={boardName}
            textClassName="navbar__board-name"
            wrapperClassName="navbar__board-name-wrapper"
            setText={setBoardName}
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
          <div class="navbar__profile-picture">
            <img
              class="navbar__profile-picture"
              draggable="false"
              src="/static/img/KarlMarks.jpg"
              alt="ProfilePicture"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
