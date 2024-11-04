import { Button } from '@/components/Button';
import { SelectBox, SelectBoxOption } from '@/components/SelectBox';
import { ComponentProps } from '@/jsxCore/types';
import { EditableText } from '@/components/EditableText';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { UserPopup } from './UserPopup';
import { useState } from '@/jsxCore/hooks';
import { goToUrl } from '@/stores/routerStore';
import { openBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
import { useMeStore } from '@/stores/meStore';
import { updateMembers } from '@/stores/members';
import { updateBoard } from '@/api/boards';
import { showToast } from '@/stores/toastNotificationStore';

interface NavBarProps extends ComponentProps {
  leftPanelOpened: boolean;
  setLeftPanelOpened: (state: boolean) => void;
}

const modeOptions: SelectBoxOption[] = [
  { title: 'Канбан', icon: 'bi-kanban' },
  { title: 'Список', icon: 'bi-ui-checks' },
];

/**
 * Компонент навбара, который отображается, когда открыта доска
 */
export const NavBar = (props: NavBarProps) => {
  const activeBoard = useActiveBoardStore();
  const me = useMeStore();
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
              goToUrl('/');
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
          {activeBoard !== undefined && (
            <div class="navbar__group">
              <SelectBox
                key="mode_select"
                options={modeOptions}
                currentIndex={0}
              />
              <div style="width: 140px"></div>
              <EditableText
                key="board_name_text"
                text={activeBoard?.title ?? 'Загрузка'}
                textClassName="navbar__board-name"
                wrapperClassName="navbar__board-name-wrapper"
                setText={(newText) => {
                  updateBoard(activeBoard.id, newText, '').then(() => {
                    showToast('Успешно изменено название доски!', 'success');
                    activeBoard.title = newText;
                    setActiveBoardStore(activeBoard);
                  });
                }}
              />
              <Button
                key="settings"
                icon="bi-gear"
                callback={() => {
                  updateMembers();
                  openBoardSettingsModalDialog();
                }}
              />
            </div>
          )}
          <div class="flex-grow"></div>
          <div class="navbar__group">
            {/* <Button key="notification_btn" icon="bi-bell" /> */}
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
                src={me?.avatarImageUrl}
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
