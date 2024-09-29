import { BoardCardComponent } from '/components/BoardCard.js';
import { ButtonComponent } from '/components/Button.js';
import { boardsStore } from '/stores/boardsStore.js';
import { getAppISS, interfaceStateStore } from '/stores/interfaceStateStore.js';

export const LeftPanel = () => {
  return (
    <div class="left_menu">
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
