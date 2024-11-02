import { ComponentProps } from '@/jsxCore/types';
import './boardCard.scss';
import { Board } from '@/types/board';
import { formatTime } from '@/utils/time';
import { goToUrl } from '@/stores/routerStore';

interface BoardCardProps extends ComponentProps {
  board: Board;
}

/**
 * Компонент карточки доски для левого меню
 * @param props Пропсы карточки доски для левого меню
 * @returns JSX карточки доски для левого меню
 */
export const BoardCard = (props: BoardCardProps) => {
  return (
    <div
      class="board-card"
      ON_click={() => {
        goToUrl(`/app/board_${props.board.id}/kanban`);
      }}
    >
      <div class="board-card__title">{props.board.title}</div>

      <img class="board-card__cover" src={props.board.backgroundImageUrl}></img>

      <div class="board-card__subtext">
        Последнее посещение: {formatTime(props.board.lastVisit)}
      </div>

      <div class="board-card__subtext">
        Последнее обновление: {formatTime(props.board.lastUpdate)}
      </div>
    </div>
  );
};
