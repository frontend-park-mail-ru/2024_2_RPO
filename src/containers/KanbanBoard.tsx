import { ComponentProps } from '@/jsxCore/types';
import { KanbanColumn } from '../components/KanbanColumn';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { Button } from '@/components/Button';
import { ActiveBoard } from '@/types/types';
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
import { moveCard, moveColumn } from '@/api/dnd';

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
    createColumn(activeBoardStore.board.id, { title: value }).then(
      (newColumn) => {
        if (newColumn !== undefined) {
          newColumn.cards = [];
          activeBoardStore.columns.push(newColumn);
          setActiveBoardStore(activeBoardStore);
          setNewColumnName('');
        }
      }
    );
    setIsOpened(false);
  };

  return (
    <div class="kanban-column" style="padding-top: 4px;">
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
          extraRounded
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
            variant="accent"
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
            variant="default"
            icon="bi-x-lg"
            text="Отмена"
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
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const [dndPos, setDndPos] = useState([50, 50]);
  const dndStore = useDndStore();
  const stopDnd = () => {
    if (dndStore?.type === 'card') {
      let prevCard: number = -1,
        nextCard: number = -1;
      activeBoard.columns[dndStore.prevColIdx].cards = activeBoard.columns[
        dndStore.prevColIdx
      ].cards.map((crd, idx) => {
        if (crd.type === 'stub') {
          if (idx > 0) {
            prevCard =
              activeBoard.columns[dndStore.prevColIdx].cards[idx - 1].id;
          }
          if (idx < activeBoard.columns[dndStore.prevColIdx].cards.length - 1) {
            nextCard =
              activeBoard.columns[dndStore.prevColIdx].cards[idx + 1].id;
          }
          return dndStore.cardData;
        }
        return crd;
      });

      moveCard(
        dndStore.cardData.id,
        activeBoard.columns[dndStore.prevColIdx].id,
        prevCard,
        nextCard
      );
    } else if (dndStore?.type === 'column') {
      moveColumn(
        dndStore.activeColumn.id,
        activeBoard.columns[dndStore.activeColumnIdx + 1]?.id ?? -1,
        activeBoard.columns[dndStore.activeColumnIdx - 1]?.id ?? -1
      );
    }
    setActiveBoardStore(activeBoard);
    setDndStore(undefined);
  };

  return (
    <div class="kanban-board">
      {dndStore !== undefined && (
        <div
          style="z-index:1000; position: fixed; height: 100vh; width: 100vw"
          ON_mousemove={(ev: PointerEvent) => {
            setDndPos([ev.x - dndStore.offset[0], ev.y - dndStore.offset[1]]);
            if (dndStore.type === 'card') {
              const movingCardId = dndStore.cardData.id;
              // Вычислить, в какой колонке находится новое положение карточки
              const destColIdx = calculateColumnIdx(ev.x);

              // Если курсор находится вне колонок, ничего не делать
              if (destColIdx === -1) {
                return;
              }

              // Вычислить, какой индекс в колонке будет иметь карточка
              const colPositions = calculateCardBoundingBoxes(
                destColIdx,
                activeBoard.columns[destColIdx].cards.map((a) => {
                  return a.id;
                })
              );
              const cardNewIdx = colPositions.findIndex((pos) => {
                return isInRectangle(pos, ev.x, ev.y);
              });

              // Если это та же карточка, ничего не делать
              if (
                activeBoard.columns[destColIdx].cards[cardNewIdx]?.id ===
                  movingCardId ||
                cardNewIdx === -1
              ) {
                return;
              }

              // Удалить карточку с предыдущего положения
              activeBoard.columns[dndStore.prevColIdx].cards =
                activeBoard.columns[dndStore.prevColIdx].cards.filter(
                  (card) => {
                    return card.id !== dndStore.cardData.id;
                  }
                );

              // Установить карточку в новое положение
              activeBoard.columns[destColIdx].cards.splice(cardNewIdx, 0, {
                type: 'stub',
                height: cardHeights.get(movingCardId) ?? 0,
                id: movingCardId,
              });
              dndStore.prevColIdx = destColIdx;

              // Обновить Store
              setActiveBoardStore(activeBoard);
              setDndStore(dndStore);
            } else if (dndStore.type === 'column') {
              // Вычислить новый индекс колонки
              const newIdx = calculateColumnDestinationIdx(ev.x);
              // Если он не совпадает, подвинуть колонку
              if (newIdx !== dndStore.activeColumnIdx) {
                dndStore.activeColumnIdx = newIdx;
                activeBoard.columns = activeBoard.columns.filter((col) => {
                  return col.id !== dndStore.activeColumn.id;
                });
                activeBoard.columns.splice(newIdx, 0, {
                  ...dndStore.activeColumn,
                  isStub: true,
                });
                setDndStore(dndStore);
                setActiveBoardStore(activeBoard);
              }
            }
          }}
          ON_mouseup={stopDnd}
          ON_mouseleave={stopDnd}
        />
      )}
      {activeBoard.columns.map((columnData, idx) => {
        return (
          <KanbanColumn
            key={`column_${columnData.id}`}
            columnIndex={idx}
            columnId={columnData.id}
          />
        );
      })}
      {dndStore?.type === 'card' && (
        <div
          style={`position: absolute; opacity: 0.4;
            transform-origin: ${dndStore.offset[0]}px ${dndStore.offset[1]}px;
            transform: rotate(-5deg);
            left: ${dndPos[0]}px; top: ${dndPos[1]}px`}
        >
          <KanbanCard
            key="draggable_card"
            card={dndStore?.cardData}
            columnIdx={0}
          />
        </div>
      )}
      {dndStore?.type === 'column' && (
        <div
          style={`position: absolute; opacity: 0.4;
            transform-origin: ${dndStore.offset[0]}px ${dndStore.offset[1]}px;
            transform: rotate(-5deg);
            left: ${dndPos[0]}px; top: ${dndPos[1]}px`}
        >
          <KanbanColumn
            key="draggable_column"
            columnId={dndStore.activeColumn.id}
            columnIndex={dndStore.activeColumnIdx}
          />
        </div>
      )}
      {activeBoard.myRole !== 'viewer' && (
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

const calculateCardBoundingBoxes = (
  columnIdx: number,
  cardIds: number[]
): CardPosition[] => {
  //Рассчитать реальные позиции карточек
  const cardPositions: CardPosition[] = [];
  let accHeight = 74;
  accHeight += colHeaderHeights.get(columnIdx) ?? 0;
  accHeight += 8;
  const xCoord = 14 + columnIdx * 286 + 8;

  // Костыль, чтобы можно было перетащить карточку в пустую колонку
  if (cardIds.length === 0) {
    return [{ x: xCoord, w: 256, cardId: -228, y: accHeight, h: 100 }];
  }

  // Расчёт высот и y-координат
  cardIds.forEach((cardId) => {
    cardPositions.push({
      x: xCoord,
      y: accHeight,
      w: 256,
      h: cardHeights.get(cardId) ?? 0,
      cardId,
    });
    accHeight += 8;
    accHeight += cardHeights.get(cardId) ?? 0;
  });

  // Пересчитать Bounding Box, сделав коррекцию на разницу высот карточек
  const boundingBoxes: CardPosition[] = [];
  cardIds.forEach((cardId, idx) => {
    const currPos = cardPositions[idx];
    let topY: number = 0;
    let bottomY: number = 0;
    // Пересчёт верхней границы карточки
    if (idx > 0) {
      const prevPos = cardPositions[idx - 1];
      topY = (currPos.y + currPos.h + prevPos.y) / 2;
    } else {
      topY = currPos.y;
    }
    // Пересчёт нижней границы карточки
    if (idx !== cardIds.length - 1) {
      const nextPos = cardPositions[idx + 1];
      bottomY = (currPos.y + nextPos.y + nextPos.h) / 2;
    } else {
      bottomY = currPos.y + currPos.h;
    }
    boundingBoxes.push({
      x: currPos.x,
      w: currPos.w,
      y: topY,
      h: bottomY - topY,
      cardId,
    });
  });
  return boundingBoxes;
};

const calculateColumnDestinationIdx = (x: number) => {
  if (x < 14 + 272 / 2) {
    return 0;
  }
  return Math.min(
    (useActiveBoardStore()?.columns.length ?? 0) - 1,
    Math.floor((x - 14 - 272 / 2) / (272 + 14) + 1)
  );
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
