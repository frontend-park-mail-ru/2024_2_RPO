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
import { showToast } from '@/stores/toastNotificationStore';
import { KanbanCard } from '@/components/KanbanCard';
import { setDndStore, useDndStore } from '@/stores/dndStore';

const NewColumnButton = () => {
  const activeBoardStore = useActiveBoardStore() as ActiveBoard;
  const [isOpened, setIsOpened] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const submitNewColumn = (value: string) => {
    if (value.length < 3) {
      showToast('Длина имени колонки может быть от 3 символов', 'error');
      return;
    }
    if (value.length > 30) {
      showToast('Длина имени колонки может быть до 30 символов', 'error');
      return;
    }
    createColumn(activeBoardStore.id, { title: value }).then((newColumn) => {
      newColumn.cards = [];
      activeBoardStore.columns.push(newColumn);
      setActiveBoardStore(activeBoardStore);
      setNewColumnName('');
    });
    setIsOpened(false);
  };

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
        <div>
          <Input
            key="col_name"
            focusOnInstance
            placeholder="Название новой колонки"
            onEscape={() => {
              setIsOpened(false);
            }}
            onEnter={(newText) => {
              submitNewColumn(newText);
            }}
            onChanged={(newText) => {
              setNewColumnName(newText);
            }}
          />
          <Button
            key="confirm_new_card"
            variant="positive"
            fullWidth
            icon="bi-plus-square"
            text="Добавить колонку"
            callback={() => {
              submitNewColumn(newColumnName);
            }}
          />
          <Button
            key="cancel_new_card"
            fullWidth
            variant="negative"
            icon="bi-x-lg"
            text="Не добавлять"
            callback={() => {
              setIsOpened(false);
              setNewColumnName('');
            }}
          />
        </div>
      )}
    </div>
  );
};

type KanbanBoardProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const KanbanBoard = (props: KanbanBoardProps) => {
  const activeBoardStore = useActiveBoardStore() as ActiveBoard;
  const [dndPos, setDndPos] = useState([50, 50]);
  const dndStore = useDndStore();
  const stopDnd = () => {
    setDndStore(undefined);
  };
  return (
    <div class="kanban-board">
      {dndStore !== undefined && (
        <div
          style="z-index:1000; position: fixed; height: 100vh; width: 100vw"
          ON_mousemove={(ev: PointerEvent) => {
            setDndPos([ev.x - dndStore.offset[0], ev.y - dndStore.offset[1]]);
          }}
          ON_mouseup={stopDnd}
          ON_mouseleave={stopDnd}
        />
      )}
      {activeBoardStore.columns.map((columnData, idx) => {
        return (
          <KanbanColumn
            key={`column_${columnData.id}`}
            columnIndex={idx}
            columnId={columnData.id}
          />
        );
      })}
      <KanbanCard
        key="draggable"
        card={{ deadline: undefined, title: '1234', id: 234 }}
        isDragging={true}
        x={dndPos[0]}
        y={dndPos[1]}
        columnId={1}
        columnIdx={0}
      />
      {activeBoardStore.myRole !== 'viewer' && (
        <NewColumnButton key="create_new_column" />
      )}
    </div>
  );
};
