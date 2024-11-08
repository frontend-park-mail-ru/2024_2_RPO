import { ComponentProps } from '@/jsxCore/types';
import './kanbanCard.scss';
import { deleteCard, updateCard } from '@/api/columnsCards';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { ActiveBoard } from '@/types/activeBoard';
import { EditableText } from './EditableText';
import { showToast } from '@/stores/toastNotificationStore';

interface KanbanCardProps extends ComponentProps {
  text: string;
  cardId: number;
  columnId: number;
  coverImageUrl?: string;
}

export const KanbanCard = (props: KanbanCardProps) => {
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  return (
    <div class="kanban-card">
      {activeBoard.myRole !== 'viewer' && (
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
      )}
      {props.coverImageUrl !== undefined ? (
        <img src={props.coverImageUrl} class="kanban-card__cover"></img>
      ) : undefined}
      <EditableText
        key="editable_text"
        wrapText
        text={props.text}
        setText={(newText, oldText) => {
          if (newText === oldText) {
            return;
          }
          if (newText.length < 3) {
            showToast(
              'Длина текста в карточке может быть от 3 символов',
              'error'
            );
            return;
          }
          updateCard(activeBoard.id, props.cardId, {
            title: newText,
            columnId: props.columnId,
          }).then((newCard) => {
            activeBoard.columns.forEach((col) => {
              col.cards.forEach((card) => {
                if (card.id === props.cardId) {
                  card.title = newCard.title;
                }
              });
            });
            setActiveBoardStore(activeBoard);
          });
        }}
      />
    </div>
  );
};
