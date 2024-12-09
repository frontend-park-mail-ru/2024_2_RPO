import { ComponentProps } from '@/jsxCore/types';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { Button } from './Button';
import { EditableText } from './EditableText';
import { ActiveBoard } from '@/types/activeBoard';
import { showToast } from '@/stores/toastNotificationStore';
import { createCard, deleteColumn, updateColumn } from '@/api/columnsCards';
import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { Input } from './Input';
import './kanbanColumn.scss';
import { KanbanCard } from './KanbanCard';
import { colHeaderHeights, setDndStore, useDndStore } from '@/stores/dndStore';

interface KanbanColumnProps extends ComponentProps {
  columnIndex: number;
  columnId: number;
}

const DND_THRESHOLD = 10;

export const KanbanColumn = (props: KanbanColumnProps) => {
  const [isInputOpened, setIsInputOpened] = useState(false);
  const [newCardText, setNewCardText] = useState('');
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const columnData = activeBoard.columns[props.columnIndex];
  const [dragStart, setDragStart] = useState<
    [x: number, y: number] | undefined
  >(undefined);
  const [dragOffset, setDragOffset] = useState<[x: number, y: number]>([0, 0]);

  const submitCreateCard = (newText: string) => {
    if (newText.length < 3) {
      showToast('Длина текста в карточке может быть от 3 символов', 'error');
      return;
    }
    createCard(activeBoard.id, {
      title: newText,
      columnId: props.columnId,
    }).then((newCard) => {
      activeBoard.columns[props.columnIndex].cards.push(newCard);
      setIsInputOpened(false);
    });
  };
  useEffectRefs((refs) => {
    setTimeout(() => {
      const header = refs.get('header') as HTMLDivElement;
      colHeaderHeights.set(props.columnIndex, header.clientHeight);
    }, 200);
  });
  return (
    <div class="kanban-column">
      <div
        class="kanban-column__header"
        ref="header"
        ON_mousedown={(ev: PointerEvent) => {
          setDragStart([ev.x, ev.y]);
          setDragOffset([ev.offsetX, ev.offsetY]);
        }}
        ON_mousemove={(ev: PointerEvent) => {
          if (dragStart !== undefined) {
            if (
              Math.sqrt(
                Math.pow(dragStart[0] - ev.x, 2) +
                  Math.pow(dragStart[1] - ev.y, 2)
              ) > DND_THRESHOLD
            ) {
              const dndStore = useDndStore();
              if (dndStore === undefined) {
                setDndStore({
                  type: 'column',
                  activeColumnIdx: props.columnIndex,
                  offset: dragOffset,
                  activeColumn: activeBoard.columns[props.columnIndex],
                });
                console.log('offset', dragOffset);
                setDragStart(undefined);
              }
            }
          }
        }}
        ON_mouseleave={() => {
          setDragStart(undefined);
        }}
        ON_mouseup={() => {
          setDragStart(undefined);
        }}
      >
        <EditableText
          readOnly={activeBoard.myRole === 'viewer'}
          text={columnData.title}
          setText={(newText, oldText) => {
            if (newText === oldText) {
              return;
            }
            if (newText.length < 3) {
              showToast(
                'Длина имени колонки может быть от 3 символов',
                'error'
              );
              return;
            }
            if (newText.length > 30) {
              showToast(
                'Длина имени колонки может быть до 30 символов',
                'error'
              );
              return;
            }
            updateColumn(props.columnId, {
              title: newText,
            }).then((newCol) => {
              activeBoard.columns[props.columnIndex].title = newCol.title;
              setActiveBoardStore(activeBoard);
            });
          }}
          key="title_editable_text"
          textClassName="kanban-column__title"
        />
        {activeBoard.myRole !== 'viewer' && (
          <div
            class="kanban-column__trash-button kanban-column__button"
            ON_click={() => {
              if (columnData.cards.length > 0) {
                showToast(
                  'Чтобы удалить колонку, надо, чтобы она была пустая',
                  'error'
                );
                return;
              }
              deleteColumn(props.columnId).then(() => {
                activeBoard.columns = activeBoard.columns.filter((col) => {
                  return col.id !== props.columnId;
                });
                setActiveBoardStore(activeBoard);
              });
            }}
          >
            <i class="bi-trash"></i>
          </div>
        )}
      </div>
      {activeBoard.columns[props.columnIndex].cards.map((card) => {
        return (
          <div style="position: relative">
            <KanbanCard
              key={`card_${card.id}`}
              card={card}
              columnIdx={props.columnIndex}
            />
          </div>
        );
      })}

      {activeBoard?.myRole !== 'viewer' && !isInputOpened && (
        <Button
          key="new_card"
          text="Добавить карточку"
          icon="bi-plus-square"
          variant="transparent"
          callback={() => {
            setIsInputOpened(true);
          }}
          fullWidth
          extraRounded
        />
      )}

      {activeBoard?.myRole !== 'viewer' && isInputOpened && (
        <div>
          <Input
            focusOnInstance
            placeholder="Текст карточки"
            key="new_card_input"
            onEscape={() => {
              setIsInputOpened(false);
            }}
            onEnter={(newText) => {
              submitCreateCard(newText);
            }}
            onChanged={(newText) => {
              setNewCardText(newText);
            }}
          />
          <Button
            key="confirm_new_card"
            variant="accent"
            fullWidth
            icon="bi-plus-square"
            text="Добавить карточку"
            callback={() => {
              submitCreateCard(newCardText);
            }}
          />
          <Button
            key="cancel_new_card"
            fullWidth
            variant="default"
            icon="bi-x-lg"
            text="Не добавлять"
            callback={() => {
              setIsInputOpened(false);
              setNewCardText('');
            }}
          />
        </div>
      )}
    </div>
  );
};
