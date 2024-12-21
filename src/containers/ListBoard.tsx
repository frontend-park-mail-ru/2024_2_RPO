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
        <div className="list-card__header">Заголовок карточки</div>
        <div className="list-card__header">Столбец</div>
        <div className="list-card__header">Свойства</div>
        <div className="list-card__header">Теги</div>
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
                  <div className="list-card__title">{col.title}</div>
                  <div class="list-card__properties">
                    {card.deadline !== undefined && <i className="bi-clock" />}
                    {card.hasCheckList && <i class="bi-check2-square" />}
                    {card.hasAttachments && <i class="bi-paperclip" />}
                    {card.hasAssignedUsers && <i class="bi-person-plus" />}
                    {card.hasComments && <i class="bi-chat-left-text" />}
                  </div>
                  {card.tags.length > 0 ? (
                    <div style="display: flex; flex-direction: row; column-gap: 10px; flex-wrap: wrap; row-gap: 3px; color: gray; margin-top: 10px; margin-bottom: 4px">
                      {card.tags.map((idx) => {
                        const tag = activeBoard.tags.find((t) => {
                          return t.id === idx;
                        });
                        if (tag === undefined) {
                          return <div>Ошибка</div>;
                        }
                        return (
                          <div
                            class="tag-badge"
                            style={`background-color: ${tag.color}`}
                          >
                            {tag.text}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            }
          });
        })}
        {!activeBoard?.columns.some((col) => {
          return col.cards.length > 0;
        }) && <div style="padding: 5px 5px">Пока что нет карточек!</div>}
      </div>
    </div>
  );
};
