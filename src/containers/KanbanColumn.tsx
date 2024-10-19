import { ComponentProps } from '@/jsxCore/types';
import { KanbanCard } from '@/components/KanbanCard';

type KanbanColumnProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const KanbanColumn = (props: KanbanColumnProps) => {
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
      <KanbanCard key="card0" text="Kartochka 1" />
      <KanbanCard key="card1" text="Kartochka 228" />
      <KanbanCard key="card2" text="Kartochka 137" />
    </div>
  );
};
