import { boardsStore } from '/stores/boardsStore.js';
import { getAppISS, interfaceStateStore } from '/stores/interfaceStateStore.js';

interface BoardCardProps {
  title?: string;
  lastVisit?: string;
  lastUpdate?: string;
  boardId: number;
}

export const BoardCardComponent = (props: BoardCardProps) => {
  return (
    <div class="left__menu__card__info">
      {props.title !== undefined ? (
        <div
          class="left__menu__card__name__title"
          style="font-size: 18px; font-weight: bold"
        >
          {props.title}
        </div>
      ) : undefined}

      <span
        class="board_delete_link"
        ON_click={() => {
          getAppISS().isBoardDeleteDialogOpened = true;
          getAppISS().boardDeleteDialogCallback = () => {
            boardsStore.deleteBoard(props.boardId);
          };
          interfaceStateStore?.update();
        }}
      >
        Удалить доску
      </span>

      {props.lastVisit !== undefined ? (
        <div class="left__menu__card__name__text" style="font-size:12px;">
          Последнее посещение: {props.lastVisit}
        </div>
      ) : undefined}

      {props.lastUpdate !== undefined ? (
        <div class="left__menu__card__name__subtext" style="font-size:12px;">
          Последнее обновление: {props.lastUpdate}
        </div>
      ) : undefined}
    </div>
  );
};
