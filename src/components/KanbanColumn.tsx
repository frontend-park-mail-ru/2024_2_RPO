import { ComponentProps } from '@/jsxCore/types';
import { KanbanCard } from '@/components/KanbanCard';
import { useActiveBoardStore } from '@/stores/activeBoardStore';

interface KanbanColumnProps extends ComponentProps {
  columnIndex: number;
}
export const KanbanColumn = (props: KanbanColumnProps) => {
  const activeBoardStore = useActiveBoardStore();
  const columnData = activeBoardStore.columns[props.columnIndex];
  return (
    <div class="kanban-column">
      <div class="kanban-column__header">
        <div class="kanban-column__title">Апокалипсис</div>
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
    </div>
  );
};
