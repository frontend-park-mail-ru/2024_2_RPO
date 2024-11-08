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
import './navBar.scss';

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
      <nav className={['navbar']}>
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
            className={[
              'navbar__logo-link',
              props.leftPanelOpened || 'navbar__mobile-hidden',
            ]}
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
        {activeBoard === undefined && <div style="flex-grow:99999"></div>}
        <div class="navbar__rest-group">
          {activeBoard !== undefined && (
            <>
              <div
                className={[
                  props.leftPanelOpened || 'navbar__mobile-hidden',
                  'navbar__selectbox',
                ]}
              >
                <SelectBox
                  widthRem={10}
                  key="mode_select"
                  options={modeOptions}
                  currentIndex={0}
                  onChange={(idx) => {
                    if (idx === 1) {
                      showToast('Эта функция в разработке', 'warning');
                    }
                  }}
                />
              </div>
              <div class="navbar__board-controls">
                <div style="width: 140px" class="navbar__mobile-hidden"></div>
                <div
                  className={[
                    'navbar__board-name',
                    props.leftPanelOpened ? 'navbar__mobile-hidden' : '',
                  ]}
                >
                  <EditableText
                    key="board_name_text"
                    text={activeBoard?.title ?? 'Загрузка'}
                    readOnly={
                      activeBoard.myRole === 'viewer' ||
                      activeBoard.myRole === 'editor'
                    }
                    textClassName="navbar__board-name"
                    wrapperClassName="navbar__board-name-wrapper"
                    setText={(newText) => {
                      updateBoard(activeBoard.id, newText, '').then(() => {
                        showToast(
                          'Успешно изменено название доски!',
                          'success'
                        );
                        activeBoard.title = newText;
                        setActiveBoardStore(activeBoard);
                      });
                    }}
                  />
                  <div style="flex-grow:1" class="navbar__mobile-only"></div>
                  <Button
                    key="settings"
                    icon="bi-gear"
                    callback={() => {
                      updateMembers();
                      openBoardSettingsModalDialog();
                    }}
                  />
                </div>
                <div style="flex-grow:1" class="navbar__mobile-hidden"></div>
              </div>
            </>
          )}
          <div class="navbar__right-group">
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
              className={[
                'navbar__profile-picture',
                props.leftPanelOpened || 'navbar__mobile-hidden',
              ]}
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
