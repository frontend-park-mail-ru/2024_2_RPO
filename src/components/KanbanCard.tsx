import { ComponentProps } from '@/jsxCore/types';
import './kanbanCard.scss';
import { deleteCard } from '@/api/columnsCards';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { ActiveBoard } from '@/types/activeBoard';
import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { Button } from './Button';
import { getCardDetails } from '@/api/cardDetails';
import { setCardDetailsStore } from '@/stores/cardDetailsStore';

interface KanbanCardProps extends ComponentProps {
  text: string;
  cardId: number;
  columnId: number;
  coverImageUrl?: string;
}

interface EditableProps extends ComponentProps {
  initialText: string;
}

const Editable = (props: EditableProps) => {
  const [init, setInit] = useState(true);

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

  return (
    <div>
      <textarea ref="textarea" />
      <Button
        key="save_text"
        variant="accent"
        text="Сохранить"
        icon="bi-floppy"
      />
    </div>
  );
};

export const KanbanCard = (props: KanbanCardProps) => {
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const [isInput, setIsInput] = useState(false);
  return (
    <div class="kanban-card">
      {activeBoard.myRole !== 'viewer' && (
        <div
          class="kanban-card__delete-button"
          ON_click={() => {
            deleteCard(props.cardId).then(() => {
              activeBoard.columns.forEach((column) => {
                column.cards = column.cards.filter((card) => {
                  return card.id !== props.cardId;
                });
              });
              setActiveBoardStore(activeBoard);
            });
          }}
        >
          <i class="bi-trash" />
        </div>
      )}
      {props.coverImageUrl !== undefined ? (
        <img src={props.coverImageUrl} class="kanban-card__cover"></img>
      ) : undefined}
      {isInput ? (
        <Editable key="editable_card" initialText={props.text} />
      ) : (
        <div
          ON_dblclick={() => {
            setIsInput(true);
          }}
          ON_click={() => {
            getCardDetails(props.cardId).then((val) => {
              setCardDetailsStore(val);
              console.log(val);
            });
          }}
        >
          {props.text}
        </div>
      )}
    </div>
  );
};
