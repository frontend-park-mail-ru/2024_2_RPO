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
  const [newCardText, setNewCardText] = useState('');
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const columnData = activeBoard.columns[props.columnIndex];
  const submitCreateCard = (newText: string) => {
    if (newText.length < 3) {
      showToast(
        'Длина текста в карточке может быть от 3 символов',
        'error'
      );
      return;
    }
    createCard(activeBoard.id, {
      title: newText,
      columnId: props.columnId,
    }).then((newCard) => {
      activeBoard.columns[props.columnIndex].cards.push(newCard);
      setIsInputOpened(false);
    });
  };
  return (
    <div class="kanban-column">
      <div class="kanban-column__header">
        <EditableText
          readOnly={activeBoard.myRole === 'viewer'}
          text={columnData.title}
          setText={(newText, oldText) => {
            if (newText === oldText) {
              return;
            }
            if (newText.length < 3) {
              showToast(
                'Длина имени колонки может быть от 3 символов',
                'error'
              );
              return;
            }
            if (newText.length > 30) {
              showToast(
                'Длина имени колонки может быть до 30 символов',
                'error'
              );
              return;
            }
            updateColumn(activeBoard.id, props.columnId, {
              title: newText,
            }).then((newCol) => {
              activeBoard.columns[props.columnIndex].title = newCol.title;
              setActiveBoardStore(activeBoard);
            });
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

      <div style="height: 1px" />
      {activeBoard?.myRole !== 'viewer' && isInputOpened && (
        <div>
          <Input
            focusOnInstance
            placeholder="Текст карточки"
            key="new_card_input"
            onEscape={() => {
              setIsInputOpened(false);
            }}
            onEnter={(newText) => {
              submitCreateCard(newText);
            }}
            onChanged={(newText) => {
              setNewCardText(newText);
            }}
          />
          <Button
            key="confirm_new_card"
            variant="positive"
            fullWidth
            icon="bi-plus-square"
            text="Добавить карточку"
            callback={() => {
              submitCreateCard(newCardText);
            }}
          />
          <Button
            key="cancel_new_card"
            fullWidth
            variant="negative"
            icon="bi-x-lg"
            text="Не добавлять"
            callback={() => {
              setIsInputOpened(false);
              setNewCardText('');
            }}
          />
        </div>
      )}
    </div>
  );
};
