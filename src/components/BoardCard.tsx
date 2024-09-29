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
    <div class="left-menu__card__info">
      {props.title !== undefined ? (
        <div
          class="left-menu__card-name__title"
        >
          {props.title}
        </div>
      ) : undefined}

      <span
        class="board-delete-link"
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
        <div class="left-menu__card-name__subtext">
          Последнее посещение: {props.lastVisit}
        </div>
      ) : undefined}

      {props.lastUpdate !== undefined ? (
        <div class="left-menu__card-name__subtext">
          Последнее обновление: {props.lastUpdate}
        </div>
      ) : undefined}
    </div>
  );
};
