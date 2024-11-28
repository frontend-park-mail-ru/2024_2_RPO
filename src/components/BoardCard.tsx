import { ComponentProps } from '@/jsxCore/types';
import './boardCard.scss';
import { Board } from '@/types/board';
import { formatTime } from '@/utils/time';
import { goToUrl } from '@/stores/routerStore';
import { useActiveBoardStore } from '@/stores/activeBoardStore';

interface BoardCardProps extends ComponentProps {
  board: Board;
  onSelect: () => void;
}

/**
 * Компонент карточки доски для левого меню
 * @param props Пропсы карточки доски для левого меню
 * @returns JSX карточки доски для левого меню
 */
export const BoardCard = (props: BoardCardProps) => {
  const activeBoard = useActiveBoardStore();

  return (
    <div
      className={[
        'board-card',
        activeBoard?.id === props.board.id ? 'board-card__active' : '',
      ]}
      ON_click={() => {
        props.onSelect();
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
