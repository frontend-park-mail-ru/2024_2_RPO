import { ComponentProps } from '@/jsxCore/types';
import { KanbanCard } from '@/components/KanbanCard';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { Button } from './Button';
import { EditableText } from './EditableText';
import { ActiveBoard } from '@/types/activeBoard';
import { noop } from '@/utils/noop';
import { showToast } from '@/stores/toastNotificationStore';
import { deleteColumn, updateColumn } from '@/api/columnsCards';

interface KanbanColumnProps extends ComponentProps {
  columnIndex: number;
  columnId: number;
}
export const KanbanColumn = (props: KanbanColumnProps) => {
  const activeBoardStore = useActiveBoardStore() as ActiveBoard;
  const columnData = activeBoardStore.columns[props.columnIndex];
  return (
    <div class="kanban-column">
      <div class="kanban-column__header">
        <EditableText
          text={columnData.title}
          setText={(newText) => {
            updateColumn(activeBoardStore.id, props.columnId, {
              title: newText,
            });
          }}
          key="title_editable_text"
          textClassName="kanban-column__title"
        />
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
            deleteColumn(activeBoardStore.id, props.columnId).then(() => {
              activeBoardStore.columns = activeBoardStore.columns.filter(
                (col) => {
                  return col.id !== props.columnId;
                }
              );
              setActiveBoardStore(activeBoardStore);
            });
          }}
        >
          <i class="bi-trash"></i>
        </div>
        <div
          class="kanban-column__dots-button kanban-column__button"
          ON_click={() => {
            showToast('Зачем Вы нажали на эту кнопку??', 'warning');
          }}
        >
          <i class="bi-three-dots"></i>
        </div>
      </div>
      {columnData.cards.map((cardData) => {
        return (
          <KanbanCard
            key={`card_${cardData.id}`}
            text={cardData.title}
            coverUrl={cardData.coverImageUrl}
          />
        );
      })}
      {activeBoardStore?.myRole !== 'viewer' && (
        <Button
          key="new_card"
          text="Добавить карточку"
          icon="bi-plus-square"
          variant="transparent"
          fullWidth
        />
      )}
      <div style="height: 1px" />
    </div>
  );
};
