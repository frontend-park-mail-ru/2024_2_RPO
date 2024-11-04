import { ComponentProps } from '@/jsxCore/types';
import './kanbanCard.scss';
import { deleteCard } from '@/api/columnsCards';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { ActiveBoard } from '@/types/activeBoard';

interface KanbanCardProps extends ComponentProps {
  text: string;
  cardId: number;
  coverImageUrl?: string;
}

export const KanbanCard = (props: KanbanCardProps) => {
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  return (
    <div class="kanban-card">
      <div
        class="kanban-card__delete-button"
        ON_click={() => {
          deleteCard(activeBoard.id, props.cardId).then(() => {
            activeBoard.columns.forEach((column) => {
              column.cards = column.cards.filter((card) => {
                return card.id !== props.cardId;
              });
            });
            setActiveBoardStore(activeBoard);
          });
        }}
      >
        <i class="bi-trash" />
      </div>
      {props.coverImageUrl !== undefined ? (
        <img src={props.coverImageUrl} class="kanban-card__cover"></img>
      ) : undefined}
      {props.text}
    </div>
  );
};
