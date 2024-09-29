import { BoardCardComponent } from '/components/BoardCard.js';
import { ButtonComponent } from '/components/Button.js';
import { boardsStore } from '/stores/boardsStore.js';
import { getAppISS, interfaceStateStore } from '/stores/interfaceStateStore.js';

export const LeftPanel = () => {
  return (
    <div class="left_menu">
      <div
        class="left__menu__header"
        style="width: 100%; height: 58px; display: flex;  align-items: center; gap: 10px;"
      >
        <div class="left_menu__left_elements">
          <div
            class="x-lg"
            ON_click={() => {
              getAppISS().isLeftPanelOpened = false;
              interfaceStateStore?.update();
            }}
          ></div>
          <div
            class="logo__left__menu_header"
            style="user-select: none; display: flex; align-items: center; gap: 10px;"
          ></div>
        </div>
      </div>
      <div
        class="left__menu__body"
        style="overflow-y: auto; padding-bottom: 80px;"
      >
        <div
          class="first-level"
          style="display: flex; align-items:center; gap: 50px; margin-left: 14px; margin-top: 30px"
        >
          <div
            class="left__menu__body__name"
            style="font-size: 22px; font-weight: 600"
          >
            Мои доски
          </div>
          <div class="star">
            <div
              class="bi-star"
              style="margin-right: auto; margin-left: auto;height: 16px; margin-bottom: 7px"
            ></div>
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
