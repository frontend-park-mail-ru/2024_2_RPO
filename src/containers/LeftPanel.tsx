import { BoardCardComponent } from '@/components/BoardCard';
import { ButtonComponent } from '@/components/Button';
import { boardsStore } from '@/stores/boardsStore';
import { getAppISS, interfaceStateStore } from '@/stores/interfaceStateStore';

/**
 * Компонент левой панели
 * @param props Пропсы левой панели
 * @returns JSX левой панели
 */
export const LeftPanel = () => {
  return (
    <div class="left-menu">
      <div class="left-menu__header">
        <div class="left-menu__left-elements">
          <div
            class="x-lg"
            ON_click={() => {
              getAppISS().isLeftPanelOpened = false;
              interfaceStateStore?.update();
            }}
          ></div>
        </div>
      </div>
      <div class="left-menu__body">
        <div class="left-menu__first-level">
          <div class="left-menu__body-name">
            <span>Мои доски</span>
            {ButtonComponent({ icon: 'bi-star' })}
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
        {ButtonComponent({
          icon: 'bi-plus-square',
          text: 'Добавить доску',
          callback: () => {
            getAppISS().isNewBoardDialogOpened = true;
            interfaceStateStore?.update();
          },
        })}
      </div>
    </div>
  );
};
