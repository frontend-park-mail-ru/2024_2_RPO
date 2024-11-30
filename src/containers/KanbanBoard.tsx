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
import {
  cardHeights,
  colHeaderHeights,
  setDndStore,
  useDndStore,
} from '@/stores/dndStore';

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
    if (dndStore !== undefined) {
      activeBoardStore.columns[dndStore.prevColIdx].cards =
        activeBoardStore.columns[dndStore.prevColIdx].cards.map((crd) => {
          if (crd.type === 'stub') return dndStore.cardData;
          return crd;
        });
      setActiveBoardStore(activeBoardStore);
      setDndStore(undefined);
    }
  };

  return (
    <div class="kanban-board">
      {dndStore !== undefined && (
        <div
          style="z-index:1000; position: fixed; height: 100vh; width: 100vw"
          ON_mousemove={(ev: PointerEvent) => {
            setDndPos([ev.x - dndStore.offset[0], ev.y - dndStore.offset[1]]);
            const movingCardId = dndStore.cardData.id;
            // Вычислить, в какой колонке находится новое положение карточки
            const destColIdx = calculateColumnIdx(ev.x);

            // Если курсор находится вне колонок, ничего не делать
            if (destColIdx === -1) {
              return;
            }

            // Вычислить, какой индекс в колонке будет иметь карточка
            const colPositions = calculateCardPositions(
              destColIdx,
              activeBoardStore.columns[destColIdx].cards.map((a) => {
                return a.id;
              })
            );
            const cardNewIdx = colPositions.findIndex((pos) => {
              return isInRectangle(pos, ev.x, ev.y);
            });

            // Если это та же карточка, ничего не делать
            if (
              activeBoardStore.columns[destColIdx].cards[cardNewIdx]?.id ===
                movingCardId ||
              cardNewIdx === -1
            ) {
              return;
            }

            // Удалить карточку с предыдущего положения
            activeBoardStore.columns[dndStore.prevColIdx].cards =
              activeBoardStore.columns[dndStore.prevColIdx].cards.filter(
                (card) => {
                  return card.id !== dndStore.cardData.id;
                }
              );

            // Установить карточку в новое положение
            activeBoardStore.columns[destColIdx].cards.splice(cardNewIdx, 0, {
              type: 'stub',
              height: cardHeights.get(movingCardId) ?? 0,
              id: movingCardId,
            });
            dndStore.prevColIdx = destColIdx;

            // Обновить Store
            setActiveBoardStore(activeBoardStore);
            setDndStore(dndStore);
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
      {dndStore !== undefined && (
        <div
          style={`position: absolute; opacity: 0.4;
            transform-origin: ${dndStore.offset[0]}px ${dndStore.offset[1]}px;
            transform: rotate(-5deg);
            left: ${dndPos[0]}px; top: ${dndPos[1]}px`}
        >
          <KanbanCard key="draggable" card={dndStore?.cardData} columnIdx={0} />
        </div>
      )}
      {activeBoardStore.myRole !== 'viewer' && (
        <NewColumnButton key="create_new_column" />
      )}
    </div>
  );
};

interface CardPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  cardId: number;
}

const calculateCardPositions = (
  columnIdx: number,
  cardIds: number[]
): CardPosition[] => {
  const ret: CardPosition[] = [];
  let accHeight = 74;
  accHeight += colHeaderHeights.get(columnIdx) ?? 0;
  accHeight += 8;
  const xCoord = 14 + columnIdx * 286 + 8;
  cardIds.forEach((cardId) => {
    ret.push({
      x: xCoord,
      y: accHeight,
      w: 256,
      h: cardHeights.get(cardId) ?? 0,
      cardId,
    });
    accHeight += 8;
    accHeight += cardHeights.get(cardId) ?? 0;
  });
  return ret;
};

// Вычислить индекс колонки, в которой находится карточка
const calculateColumnIdx = (x: number) => {
  const columnsCount = useActiveBoardStore()?.columns.length ?? 0;
  const idx = Math.floor(x / (14 + 272));
  if (x - (14 + 272) * idx < 14) {
    return -1;
  }
  if (idx >= columnsCount) {
    return -1;
  }
  return idx;
};

// Определить, находится ли точка в прямоугольнике
const isInRectangle = (
  square: { x: number; y: number; w: number; h: number },
  x1: number,
  y1: number
) => {
  return (
    x1 <= square.x + square.w &&
    x1 >= square.x &&
    y1 <= square.y + square.h &&
    y1 >= square.y
  );
};
