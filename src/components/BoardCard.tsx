import { boardsStore } from '@/stores/boardsStore';
import { interfaceStateStore } from '@/stores/interfaceStateStore';

interface BoardCardProps {
  title?: string;
  lastVisit?: string;
  lastUpdate?: string;
  boardId: number;
}

/**
 * Компонент карточки доски для левого меню
 * @param props Пропсы карточки доски для левого меню
 * @returns JSX карточки доски для левого меню
 */
export const BoardCardComponent = (props: BoardCardProps) => {
  return (
    <div class="left-menu__card__info">
      {props.title !== undefined ? (
        <div class="left-menu__board-card__title">{props.title}</div>
      ) : undefined}

      <span
        class="board-delete-link"
        ON_click={() => {
          interfaceStateStore.appState.isBoardDeleteDialogOpened = true;
          interfaceStateStore.appState.boardDeleteDialogCallback = () => {
            boardsStore.deleteBoard(props.boardId);
          };
          interfaceStateStore?.update();
        }}
      >
        Удалить доску
      </span>

      {props.lastVisit !== undefined ? (
        <div class="left-menu__board-card__subtext">
          Последнее посещение: {props.lastVisit}
        </div>
      ) : undefined}

      {props.lastUpdate !== undefined ? (
        <div class="left-menu__board-card__subtext">
          Последнее обновление: {props.lastUpdate}
        </div>
      ) : undefined}
    </div>
  );
};
