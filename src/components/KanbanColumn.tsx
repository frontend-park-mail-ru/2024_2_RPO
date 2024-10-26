import { ComponentProps } from '@/jsxCore/types';
import { KanbanCard } from '@/components/KanbanCard';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { Button } from './Button';
import { EditableText } from './EditableText';
import { useState } from '@/jsxCore/hooks';

interface KanbanColumnProps extends ComponentProps {
  columnIndex: number;
}
export const KanbanColumn = (props: KanbanColumnProps) => {
  const activeBoardStore = useActiveBoardStore();
  const columnData = activeBoardStore.columns[props.columnIndex];
  const [title, setTitle] = useState('Апокалипсис');
  return (
    <div class="kanban-column">
      <div class="kanban-column__header">
        <EditableText
          text={title}
          setText={setTitle}
          key="title_editable_text"
          textClassName='kanban-column__title'
        />
        <div class="kanban-column__dots-button">
          <i
            class="bi-three-dots"
            style="margin-left: 3px; margin-top: 3px;"
          ></i>
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
      {activeBoardStore.myPermissions.canWrite && (
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
