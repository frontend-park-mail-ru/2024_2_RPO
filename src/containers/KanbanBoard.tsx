import { ComponentProps } from '@/jsxCore/types';
import { KanbanColumn } from './KanbanColumn';
import { useActiveBoardStore } from '@/stores/activeBoardStore';

type KanbanBoardProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const KanbanBoard = (props: KanbanBoardProps) => {
  const activeBoardStore = useActiveBoardStore();
  console.log(activeBoardStore);
  return (
    <div class="kanban-board">
      {activeBoardStore.columns.map((columnData, idx) => {
        return (
          <KanbanColumn key={`column_${columnData.id}`} columnIndex={idx} />
        );
      })}
    </div>
  );
};
