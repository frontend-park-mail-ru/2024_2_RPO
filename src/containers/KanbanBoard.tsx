import { ComponentProps } from '@/jsxCore/types';
import { KanbanColumn } from '../components/KanbanColumn';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { Button } from '@/components/Button';

const NewColumnButton = () => {
  return (
    <div class="kanban-column">
      <Button
        key="new_column"
        text="Новая колонка"
        icon="bi-plus-square"
        variant="transparent"
        fullWidth
      />
    </div>
  );
};

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
      {activeBoardStore.myPermissions.canWrite && (
        <NewColumnButton key="create_new_column" />
      )}
    </div>
  );
};
