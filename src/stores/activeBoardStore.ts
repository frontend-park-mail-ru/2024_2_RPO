import { ActiveBoard, BoardColumn } from 'types/active_board.js';
import { Card } from 'types/card.js';

class ActiveBoardStore {
  activeBoard: ActiveBoard; // TODO рассмотреть возможность установки private
  constructor() {
    this.activeBoard = {
      id: 0,
      title: 'Моя любимая доска',
      columns: [
        {
          id: 1,
          title: 'Задачи',
          cards: [
            { id: 228, title: 'Пример задачи, для которой не задана обложка' },
            {
              id: 1337,
              title: 'Пример задачи, для которой задана обложка',
              coverImageUrl: '/static/image/lada_vesta.png',
            },
          ],
        },
      ],
    };
  }

  addCard(card: Card, column: BoardColumn) {
    column.cards.push(card);
    //TODO сходить в базу
    //TODO перерисовка
  }
  removeCard(cardToRemove: Card) {
    this.activeBoard.columns.forEach((column) => {
      column.cards = column.cards.filter((card) => card != cardToRemove);
    });
    //TODO сходить в базу
    //TODO перерисовка
  }
}

export const activeBoardStore = new ActiveBoardStore();
