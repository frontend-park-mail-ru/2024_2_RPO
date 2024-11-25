import { createBoard } from '@/api/boards';
import { BoardCard } from '@/components/BoardCard';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { updateBoards, useBoardsStore } from '@/stores/boardsStore';
import './leftPanel.scss';
import { showToast } from '@/stores/toastNotificationStore';

/**
 * Компонент левой панели
 * @param props Пропсы левой панели
 * @returns JSX левой панели
 */

type LeftPanelProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <aside class="left-menu">
      <div class="left-menu__header">
        <div class="left-menu__left-elements"></div>
      </div>
      <div class="left-menu__body">
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
                variant="positive"
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
                variant="negative"
                icon="bi-x-lg"
                text="Не добавлять"
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
              variant="positive"
              icon="bi-plus-square"
              text="Добавить доску"
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
              return <BoardCard key={`board_${board.id}`} board={board} />;
            })
          ) : (
            <div>
              У Вас нет досок. Создайте доску или попросите коллегу добавить Вас
              на доску!
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
