import { ComponentProps } from '@/jsxCore/types';
import { KanbanColumn } from './KanbanColumn';
import { useActiveBoardStore } from '@/stores/activeBoardStore';

type KanbanBoardProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const KanbanBoard = (props: KanbanBoardProps) => {
  const activeBoardStore = useActiveBoardStore();
  return (
    <div class="kanban-board">
      {activeBoardStore.columns.map((columnData) => {
        return (
          <KanbanColumn
            key={`column_${columnData.id}`}
            columnId={columnData.id}
          />
        );
      })}
    </div>
  );
};
