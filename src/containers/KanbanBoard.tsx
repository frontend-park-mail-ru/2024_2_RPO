import { ComponentProps } from '@/jsxCore/types';
import { KanbanColumn } from './KanbanColumn';

type KanbanBoardProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const KanbanBoard = (props: KanbanBoardProps) => {
  return (
    <div class="kanban-board">
      <KanbanColumn key="col1" />
      <KanbanColumn key="col2" />
    </div>
  );
};
