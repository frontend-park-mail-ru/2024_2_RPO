import { ComponentProps } from '@/jsxCore/types';
import './listBoard.scss';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { getCardDetails } from '@/api/cardDetails';
import { setCardDetailsStore } from '@/stores/cardDetailsStore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ListBoard = (props: ComponentProps) => {
  const activeBoard = useActiveBoardStore();
  return (
    <div class="list-board">
      <div class="list-board__container">
        {activeBoard?.columns.map((col) => {
          return col.cards.map((card) => {
            if (card.type === 'real') {
              return (
                <div
                  class="list-card"
                  ON_click={() => {
                    getCardDetails(card.id).then((val) => {
                      setCardDetailsStore(val);
                    });
                  }}
                >
                  <div className="list-card__title">{card.title}</div>
                  <div class="list-card__properties">
                    {card.deadline !== undefined && <i className="bi-clock" />}
                    {card.hasCheckList && <i class="bi-check2-square" />}
                    {card.hasAttachments && <i class="bi-paperclip" />}
                    {card.hasAssignedUsers && <i class="bi-person-plus" />}
                    {card.hasComments && <i class="bi-chat-left-text" />}
                  </div>
                </div>
              );
            }
          });
        })}
      </div>
    </div>
  );
};
