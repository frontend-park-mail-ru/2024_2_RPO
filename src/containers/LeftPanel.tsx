import { createBoard } from '@/api/boards';
import { BoardCard } from '@/components/BoardCard';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useEscape, useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { updateBoards, useBoardsStore } from '@/stores/boardsStore';
import './leftPanel.scss';
import { showToast } from '@/stores/toastNotificationStore';
import { searchInElastic } from '@/api/search';
import { setSearchResultStore } from '@/stores/searchResultStore';

interface LeftPanelProps extends ComponentProps {
  closeCallback: () => void;
}

/**
 * Компонент левой панели
 * @param props Пропсы левой панели
 * @returns JSX левой панели
 */
export const LeftPanel = (props: LeftPanelProps) => {
  const [inputOpened, setInputOpened] = useState(false);
  const boards = useBoardsStore() ?? [];
  const [newBoardName, setNewBoardName] = useState('');
  let validationMessage: string | undefined = undefined;
  if (newBoardName.length > 0 && newBoardName.length < 3) {
    validationMessage = 'Должно быть хотя бы 3 символа';
  } else if (newBoardName.length > 30) {
    validationMessage = 'Должно быть не больше 30 символов';
  }
  useEscape(props.closeCallback);

  const submitNewBoard = (boardName: string) => {
    if (boardName.length < 3) {
      showToast('Название доски должно быть не меньше 3 символов', 'error');
      return;
    }
    if (boardName.length > 30) {
      showToast('Название доски должно быть не больше 30 символов', 'error');
      return;
    }
    createBoard(boardName).then(() => {
      showToast('Успешно создана доска', 'success');
      setInputOpened(false);
      setNewBoardName('');
      updateBoards();
    });
  };

  return (
    <>
      <div
        className="left-panel-dark navbar__mobile-hidden"
        ON_click={props.closeCallback}
      ></div>
      <aside class="left-menu">
        <div class="left-menu__header">
          <div class="left-menu__left-elements"></div>
        </div>
        <div class="left-menu__body">
          <div style="height: 20px" class="navbar__mobile-only" />

          <div
            class="search-input__wrapper navbar__mobile-only"
            style="width: 100%"
          >
            <input
              class="search-input"
              type="text"
              id="search-bad-228"
              placeholder="Поиск"
              style="padding-left: 36px; width: 100%"
              ON_keydown={(ev: KeyboardEvent) => {
                if (ev.key === 'Enter') {
                  const query = (ev.target as HTMLInputElement).value;
                  if (query.length < 2) {
                    showToast('Введите запрос!', 'error');
                  }

                  (ev.target as HTMLInputElement).value = '';
                  props.closeCallback();

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
          <div class="navbar__mobile-only">
            <Button
              key="bad-search"
              variant="accent"
              icon="bi-search"
              text="Искать!"
              fullWidth
              callback={() => {
                const tgt = document.getElementById(
                  'search-bad-228'
                ) as HTMLInputElement;
                const query = tgt.value;
                if (query.length < 2) {
                  showToast('Введите запрос!', 'error');
                }

                tgt.value = '';
                props.closeCallback();

                searchInElastic(query).then((res: any) => {
                  if (res !== undefined) {
                    setSearchResultStore(
                      res.map((r: any) => {
                        return { cardUuid: r.cardUuid, text: r.title };
                      })
                    );
                  }
                });
              }}
            />
          </div>
          <div style="height: 20px" class="navbar__mobile-only" />
          <div style="width:100%">
            {inputOpened && (
              <>
                <Input
                  key="newBoardName"
                  focusOnInstance
                  placeholder="Название новой доски"
                  validationMessage={validationMessage}
                  onEscape={() => {
                    setInputOpened(false);
                    setNewBoardName('');
                  }}
                  onEnter={(text) => {
                    submitNewBoard(text);
                  }}
                  onChanged={(newText) => {
                    setNewBoardName(newText);
                  }}
                />
                <Button
                  key="confirm_new_board"
                  variant="accent"
                  fullWidth
                  icon="bi-plus-square"
                  text="Добавить доску"
                  callback={() => {
                    submitNewBoard(newBoardName);
                  }}
                />
                <Button
                  key="cancel_new_board"
                  fullWidth
                  icon="bi-x-lg"
                  text="Отмена"
                  callback={() => {
                    setInputOpened(false);
                    setNewBoardName('');
                  }}
                />
              </>
            )}
            {!inputOpened && (
              <Button
                key="add_board_btn"
                variant="accent"
                icon="bi-plus-square"
                text="Добавить доску"
                fullWidth
                callback={() => {
                  setInputOpened(true);
                }}
              />
            )}
          </div>

          <div class="left-menu__first-level">
            <div class="left-menu__body-name">
              <span>Мои доски</span>
            </div>
          </div>
          <div class="left-menu__card-list" style="flex-direction: column;">
            {boards.length > 0 ? (
              boards.map((board) => {
                return (
                  <BoardCard
                    key={`board_${board.id}`}
                    board={board}
                    onSelect={props.closeCallback}
                  />
                );
              })
            ) : (
              <div>
                У Вас нет досок. Создайте доску или попросите коллегу добавить
                Вас на доску!
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
