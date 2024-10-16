import { BoardCardComponent } from '@/components/BoardCard';
import { Button } from '@/components/Button';
import { ComponentProps } from '@/jsxCore/types';
import { boardsStore } from '@/stores/boardsStore';
import { interfaceStateStore } from '@/stores/interfaceStateStore';

/**
 * Компонент левой панели
 * @param props Пропсы левой панели
 * @returns JSX левой панели
 */

type LeftPanelProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LeftPanel = (props: LeftPanelProps) => {
  return (
    <div class="left-menu">
      <div class="left-menu__header">
        <div class="left-menu__left-elements">
          <div
            class="x-lg"
            ON_click={() => {
              interfaceStateStore.appState.isLeftPanelOpened = false;
              interfaceStateStore?.update();
            }}
          ></div>
        </div>
      </div>
      <div class="left-menu__body">
        <div class="left-menu__first-level">
          <div class="left-menu__body-name">
            <span>Мои доски</span>
            <Button key="favourite_btn" icon="bi-star" />
          </div>
        </div>
        <div class="cards" style="flex-direction: column;">
          {boardsStore.getWithFilters().map((board) => {
            return BoardCardComponent({
              title: board.title,
              lastUpdate: 'N/A',
              lastVisit: 'N/A',
              boardId: board.id,
            });
          })}
        </div>
        <Button
          key="add_board_btn"
          icon="bi-plus-square"
          text="Добавить доску"
          callback={() => {
            interfaceStateStore.appState.isNewBoardDialogOpened = true;
            interfaceStateStore?.update();
          }}
        />
      </div>
    </div>
  );
};
