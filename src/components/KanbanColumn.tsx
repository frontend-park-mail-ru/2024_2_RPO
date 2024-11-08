import { ComponentProps } from '@/jsxCore/types';
import { KanbanCard } from '@/components/KanbanCard';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { Button } from './Button';
import { EditableText } from './EditableText';
import { ActiveBoard } from '@/types/activeBoard';
import { showToast } from '@/stores/toastNotificationStore';
import { createCard, deleteColumn, updateColumn } from '@/api/columnsCards';
import { useState } from '@/jsxCore/hooks';
import { Input } from './Input';
import './kanbanColumn.scss';

interface KanbanColumnProps extends ComponentProps {
  columnIndex: number;
  columnId: number;
}
export const KanbanColumn = (props: KanbanColumnProps) => {
  const [isInputOpened, setIsInputOpened] = useState(false);
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const columnData = activeBoard.columns[props.columnIndex];
  return (
    <div class="kanban-column">
      <div class="kanban-column__header">
        <EditableText
          readOnly={activeBoard.myRole === 'viewer'}
          text={columnData.title}
          setText={(newText, oldText) => {
            if (newText !== oldText) {
              updateColumn(activeBoard.id, props.columnId, {
                title: newText,
              }).then((newCol) => {
                activeBoard.columns[props.columnIndex].title = newCol.title;
                setActiveBoardStore(activeBoard);
              });
            }
          }}
          key="title_editable_text"
          textClassName="kanban-column__title"
        />
        {activeBoard.myRole !== 'viewer' && (
          <div
            class="kanban-column__trash-button kanban-column__button"
            ON_click={() => {
              if (columnData.cards.length > 0) {
                showToast(
                  'Чтобы удалить колонку, надо, чтобы она была пустая',
                  'error'
                );
                return;
              }
              deleteColumn(activeBoard.id, props.columnId).then(() => {
                activeBoard.columns = activeBoard.columns.filter((col) => {
                  return col.id !== props.columnId;
                });
                setActiveBoardStore(activeBoard);
              });
            }}
          >
            <i class="bi-trash"></i>
          </div>
        )}
      </div>
      {columnData.cards.map((cardData) => {
        return (
          <KanbanCard
            key={`card_${cardData.id}`}
            text={cardData.title}
            cardId={cardData.id}
            columnId={props.columnId}
            coverImageUrl={cardData.coverImageUrl}
          />
        );
      })}

      {activeBoard?.myRole !== 'viewer' && !isInputOpened && (
        <Button
          key="new_card"
          text="Добавить карточку"
          icon="bi-plus-square"
          variant="transparent"
          callback={() => {
            setIsInputOpened(true);
          }}
          fullWidth
        />
      )}

      {activeBoard?.myRole !== 'viewer' && isInputOpened && (
        <Input
          key="new_card_input"
          onEscape={() => {
            setIsInputOpened(false);
          }}
          onEnter={(text) => {
            createCard(activeBoard.id, {
              title: text,
              columnId: props.columnId,
            }).then((newCard) => {
              activeBoard.columns[props.columnIndex].cards.push(newCard);
              setIsInputOpened(false);
            });
          }}
        />
      )}
      <div style="height: 1px" />
    </div>
  );
};
