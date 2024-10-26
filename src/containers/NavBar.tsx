import { Button } from '@/components/Button';
import { ModeSelect } from '@/components/SelectBox';
import { ComponentProps } from '@/jsxCore/types';
import { EditableText } from '@/components/EditableText';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { UserPopup } from './UserPopup';
import { useState } from '@/jsxCore/hooks';
import { noop } from '@/utils/noop';

interface NavBarProps extends ComponentProps {
  leftPanelOpened: boolean;
  setLeftPanelOpened: (state: boolean) => void;
}

/**
 * Компонент навбара, который отображается, когда открыта доска
 */
export const NavBar = (props: NavBarProps) => {
  const activeBoardStore = useActiveBoardStore();
  const [userPopupOpened, setUserPopupOpened] = useState(false);
  return (
    <>
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
          <span
            class="navbar__logo-link"
            ON_click={() => {
              history.pushState(null, '', '/');
            }}
          >
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
          </span>
        </div>
        <div class="navbar__rest navbar__group">
          <div class="navbar__group">
            <ModeSelect key="mode_select" currentMode="kanban" />
            <EditableText
              key="board_name_text"
              text={activeBoardStore.title}
              textClassName="navbar__board-name"
              wrapperClassName="navbar__board-name-wrapper"
              setText={noop}
            />
            <Button key="settings" icon="bi-gear" />
          </div>
          <div class="flex-grow"></div>
          <div class="navbar__group">
            <Button key="notification_btn" icon="bi-bell" />
            {/* Для будущего функционала: уведомлений и поиска
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
            */}
            <div
              class="navbar__profile-picture"
              ON_click={() => {
                setUserPopupOpened(true);
              }}
            >
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
      {userPopupOpened && (
        <UserPopup
          key="usr_popup"
          closeCallback={() => {
            setUserPopupOpened(false);
          }}
        />
      )}
    </>
  );
};
