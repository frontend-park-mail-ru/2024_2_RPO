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
  const boardsStore = useBoardsStore() ?? [];
  return (
    <aside class="left-menu">
      <div class="left-menu__header">
        <div class="left-menu__left-elements"></div>
      </div>
      <div class="left-menu__body">
        <div class="left-menu__first-level">
          <div class="left-menu__body-name">
            <span>Мои доски</span>
            <Button key="favourite_btn" icon="bi-star" />
          </div>
        </div>
        <div class="left-menu__card-list" style="flex-direction: column;">
          {boardsStore.map((board) => {
            return <BoardCard key={`board_${board.id}`} board={board} />;
          })}
        </div>
        <div>
          {inputOpened && (
            <Input
              key="newBoardName"
              focusOnInstance
              onEscape={() => {
                setInputOpened(false);
              }}
              onEnter={(value: string) => {
                setInputOpened(false);
                createBoard(value).then(() => {
                  showToast('Успешно создана доска', 'success');
                  updateBoards();
                });
              }}
            />
          )}
          {!inputOpened && (
            <Button
              key="add_board_btn"
              icon="bi-plus-square"
              text="Добавить доску"
              callback={() => {
                setInputOpened(true);
              }}
            />
          )}
        </div>
      </div>
    </aside>
  );
};
