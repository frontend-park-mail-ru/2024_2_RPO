import { ComponentProps } from '@/jsxCore/types';
import './kanbanCard.scss';
import { deleteCard, updateCard } from '@/api/columnsCards';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { ActiveBoard } from '@/types/activeBoard';
import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { Button } from './Button';
import { getCardDetails } from '@/api/cardDetails';
import { setCardDetailsStore } from '@/stores/cardDetailsStore';
import { Card, RealCard } from '@/types/card';
import {
  cardHeights,
  setEditLock,
  setDndStore,
  useDndStore,
  editLock,
} from '@/stores/dndStore';

interface KanbanCardProps extends ComponentProps {
  card: Card;
  columnIdx: number;
}

interface EditableProps extends ComponentProps {
  initialText: string;
  cardId: number;
  onNewCard: (newCard: Card) => void;
}

const Editable = (props: EditableProps) => {
  const [init, setInit] = useState(true);
  const [newText, setNewText] = useState(props.initialText);
  let textAreaElement: HTMLTextAreaElement | undefined = undefined;

  const recalculateHeight = () => {
    if (textAreaElement !== undefined) {
      textAreaElement.style.height = 25 + textAreaElement.scrollHeight + 'px';
    }
  };

  useEffectRefs((refs) => {
    textAreaElement = refs.get('textarea') as HTMLTextAreaElement;
    recalculateHeight();
    if (init) {
      setEditLock(true);
      setTimeout(() => {
        textAreaElement?.focus();
      }, 100);
      textAreaElement.value = props.initialText;
      setInit(false);
    }
  });

  const submit = () => {
    updateCard(props.cardId, { title: newText }).then((newCard) => {
      if (newCard !== undefined) {
        setEditLock(false);
        props.onNewCard(newCard);
      }
    });
  };

  return (
    <div style="width: 100%">
      <textarea
        className="kanban-card__textarea"
        ref="textarea"
        ON_input={(ev: InputEvent) => {
          setNewText((ev.target as HTMLInputElement).value);
          recalculateHeight();
        }}
        ON_blur={submit}
      />
      <Button
        key="save_text"
        variant="accent"
        text="Сохранить"
        icon="bi-floppy"
        callback={submit}
      />
    </div>
  );
};

const DND_THRESHOLD = 10;

let timer: number;

export const KanbanCard = (props: KanbanCardProps) => {
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const card = props.card;
  const [isInput, setIsInput] = useState(false);
  const [dragStart, setDragStart] = useState<
    [x: number, y: number] | undefined
  >(undefined);
  const [dragOffset, setDragOffset] = useState<[x: number, y: number]>([0, 0]);
  const editCallback = () => {
    clearTimeout(timer);
    setIsInput(true);
  };
  const cancelDnd = () => {
    setDragStart(undefined);
  };

  if (card.type === 'stub') {
    return (
      <div ref="card" style={`width: 256px; height: ${card.height}px`}></div>
    );
  } else {
    useEffectRefs((refs) => {
      // Таймаут нужен, чтобы обложка карточки, если она есть, успела загрузиться
      setTimeout(() => {
        const cardElement = refs.get('card') as HTMLDivElement;
        cardHeights.set(card.id, cardElement.clientHeight);
      }, 200);
    });
    return (
      <div
        ref="card"
        className="kanban-card"
        ON_mousedown={(ev: PointerEvent) => {
          if (!isInput && !editLock) {
            setDragStart([ev.x, ev.y]);
            setDragOffset([ev.offsetX, ev.offsetY]);
          }
        }}
        ON_mousemove={(ev: PointerEvent) => {
          if (isInput) {
            return;
          }
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
                  type: 'card',
                  offset: dragOffset,
                  cardData: card,
                  prevColIdx: props.columnIdx,
                });
                console.log('offset', dragOffset);
                setDragStart(undefined);
              }
            }
          }
        }}
        ON_mouseleave={cancelDnd}
        ON_mouseup={cancelDnd}
      >
        {activeBoard.myRole !== 'viewer' && (
          <div
            className="kanban-card__delete-button"
            ON_click={() => {
              deleteCard(card.id).then(() => {
                activeBoard.columns.forEach((column) => {
                  column.cards = column.cards.filter((cardToFilter) => {
                    return (cardToFilter as RealCard).id !== card.id;
                  });
                });
                setActiveBoardStore(activeBoard);
              });
            }}
          >
            <i class="bi-trash" />
          </div>
        )}
        {card.coverImageUrl !== undefined ? (
          <img src={card.coverImageUrl} class="kanban-card__cover"></img>
        ) : undefined}
        {isInput ? (
          <Editable
            key="editable_card"
            initialText={card.title}
            cardId={card.id}
            onNewCard={(crd) => {
              setDragStart(undefined);
              activeBoard.columns[props.columnIdx].cards = activeBoard.columns[
                props.columnIdx
              ].cards.map((oldCard) => {
                if (oldCard.id !== crd.id) {
                  return oldCard;
                }
                return crd;
              });
              setActiveBoardStore(activeBoard);
              setIsInput(false);
            }}
          />
        ) : (
          <div
            className="kanban-card__title"
            ON_dblclick={editCallback}
            ON_contextmenu={(ev: Event) => {
              editCallback();
              ev.stopPropagation();
            }}
            ON_click={() => {
              clearTimeout(timer);
              timer = setTimeout(() => {
                getCardDetails(card.id).then((val) => {
                  setCardDetailsStore(val);
                });
              }, 300);
            }}
          >
            <div>{card.title}</div>
            <div>
              {card.deadline !== undefined && <i className="bi-clock" />}
            </div>
          </div>
        )}
      </div>
    );
  }
};
