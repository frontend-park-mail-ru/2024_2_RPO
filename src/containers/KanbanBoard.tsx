import { ComponentProps } from '@/jsxCore/types';
import { KanbanColumn } from '../components/KanbanColumn';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { Button } from '@/components/Button';
import { ActiveBoard } from '@/types/activeBoard';
import { useState } from '@/jsxCore/hooks';
import { Input } from '@/components/Input';
import { createColumn } from '@/api/columnsCards';

const NewColumnButton = () => {
  const activeBoardStore = useActiveBoardStore() as ActiveBoard;
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div class="kanban-column">
      {!isOpened && (
        <Button
          key="new_column"
          text="Новая колонка"
          icon="bi-plus-square"
          variant="transparent"
          fullWidth
          callback={() => {
            setIsOpened(true);
          }}
        />
      )}
      {isOpened && (
        <Input
          key="col_name"
          onEscape={() => {
            setIsOpened(false);
          }}
          onEnter={(value) => {
            createColumn(activeBoardStore.id, { title: value }).then(
              (newColumn) => {
                newColumn.cards = [];
                activeBoardStore.columns.push(newColumn);
                setActiveBoardStore(activeBoardStore);
              }
            );
            setIsOpened(false);
          }}
        />
      )}
    </div>
  );
};

type KanbanBoardProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const KanbanBoard = (props: KanbanBoardProps) => {
  const activeBoardStore = useActiveBoardStore() as ActiveBoard;
  return (
    <div class="kanban-board">
      {activeBoardStore.columns.map((columnData, idx) => {
        return (
          <KanbanColumn
            key={`column_${columnData.id}`}
            columnIndex={idx}
            columnId={columnData.id}
          />
        );
      })}
      {activeBoardStore.myRole !== 'viewer' && (
        <NewColumnButton key="create_new_column" />
      )}
    </div>
  );
};
