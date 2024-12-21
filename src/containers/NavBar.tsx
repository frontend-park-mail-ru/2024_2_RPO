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
import { goToUrl, useRouterStore } from '@/stores/routerStore';
import { openBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
import { useMeStore } from '@/stores/meStore';
import { updateMembers } from '@/stores/members';
import { updateBoard } from '@/api/boards';
import { showToast } from '@/stores/toastNotificationStore';
import './navBar.scss';
import { searchInElastic } from '@/api/search';
import { setSearchResultStore } from '@/stores/searchResultStore';

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
  const router = useRouterStore();
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
                src="/static/img/logo_new6.svg"
                alt="Logo"
                style="margin-bottom: 8px; height: 45px;  margin-top: 8px;"
              />
              <div draggable="false" class="navbar__logo-link">
                Pumpkin
              </div>
            </div>
          </span>
        </div>
        {activeBoard === undefined && props.leftPanelOpened && (
          <div style="flex-grow:99999"></div>
        )}
        {activeBoard === undefined && !props.leftPanelOpened && (
          <div style="flex-grow:99999" class="navbar__mobile-hidden"></div>
        )}
        <div class="navbar__rest-group">
          {activeBoard !== undefined ? (
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
                  currentIndex={router.isList ? 1 : 0}
                  onChange={(idx) => {
                    if (idx === 1) {
                      goToUrl(
                        `${window.location.origin}/app/board_${activeBoard.board.id}/list`
                      );
                    } else {
                      goToUrl(
                        `${window.location.origin}/app/board_${activeBoard.board.id}/kanban`
                      );
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
                    text={activeBoard?.board.title ?? 'Загрузка'}
                    readOnly={
                      activeBoard.myRole === 'viewer' ||
                      activeBoard.myRole === 'editor'
                    }
                    textClassName="navbar__board-name"
                    wrapperClassName="navbar__board-name-wrapper"
                    setText={(newText) => {
                      // Проверка на длину названия
                      if (newText.length < 3) {
                        showToast('Должно быть хотя бы 3 символа', 'error');
                        return;
                      } else if (newText.length > 30) {
                        showToast('Должно быть не больше 30 символов', 'error');
                        return;
                      }

                      updateBoard(activeBoard.board.id, newText, '').then(
                        () => {
                          showToast(
                            'Успешно изменено название доски!',
                            'success'
                          );
                          activeBoard.board.title = newText;
                          setActiveBoardStore(activeBoard);
                        }
                      );
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
          ) : (
            !props.leftPanelOpened && (
              <div
                class="navbar__logo-icon navbar__mobile-only"
                style="flex-grow: 1; justify-self: center; width: 100%"
              >
                <img
                  draggable="false"
                  src="/static/img/logo_new6.svg"
                  alt="Logo"
                  style="margin-bottom: 8px; height: 45px;  margin-top: 8px;"
                />
                <div draggable="false" class="navbar__logo-link">
                  Pumpkin
                </div>
              </div>
            )
          )}
          {me !== undefined && (
            <div class="navbar__right-group">
              <div class="search-input__wrapper navbar__mobile-hidden">
                <input
                  class="search-input"
                  type="text"
                  placeholder="Поиск"
                  style="padding-left: 36px"
                  ON_keydown={(ev: KeyboardEvent) => {
                    if (ev.key === 'Enter') {
                      const query = (ev.target as HTMLInputElement).value;
                      if (query.length < 2) {
                        showToast('Введите запрос!', 'error');
                      }
                      (ev.target as HTMLInputElement).value = '';

                      searchInElastic(query).then((res: any) => {
                        if (res !== undefined) {
                          setSearchResultStore(
                            res.map((r: any) => {
                              return { cardUuid: r.cardUuid, text: r.title };
                            })
                          );
                        }
                      });
                    }
                  }}
                />
                <i class="search-input__search-icon bi-search"></i>
              </div>

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
          )}
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
