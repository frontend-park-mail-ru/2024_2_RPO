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
import { Card } from '@/types/card';

interface KanbanCardProps extends ComponentProps {
  card: Card;
  columnId: number;
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

  useEffectRefs((refs) => {
    if (init) {
      const ta = refs.get('textarea') as HTMLTextAreaElement;
      ta.focus();
      ta.value = props.initialText;
      setTimeout(() => {
        setInit(false);
      }, 100);
    }
  });

  const submit = () => {
    updateCard(props.cardId, { title: newText }).then((newCard) => {
      if (newCard !== undefined) {
        props.onNewCard(newCard);
      }
    });
  };

  return (
    <div>
      <textarea
        ref="textarea"
        ON_input={(ev: InputEvent) => {
          setNewText((ev.target as HTMLInputElement).value);
        }}
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

export const KanbanCard = (props: KanbanCardProps) => {
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const card = props.card;
  const [isInput, setIsInput] = useState(false);
  let timer: number;
  const editCallback = () => {
    clearTimeout(timer);
    setIsInput(true);
  };

  return (
    <div class="kanban-card">
      {activeBoard.myRole !== 'viewer' && (
        <div
          class="kanban-card__delete-button"
          ON_click={() => {
            deleteCard(card.id).then(() => {
              activeBoard.columns.forEach((column) => {
                column.cards = column.cards.filter((card) => {
                  return card.id !== card.id;
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
                console.log(val);
              });
            }, 300);
          }}
        >
          {card.title}
        </div>
      )}
      {}
    </div>
  );
};
