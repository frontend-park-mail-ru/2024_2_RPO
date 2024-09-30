import { ActiveBoard } from 'types/activeBoard.js';

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
}

export const activeBoardStore = new ActiveBoardStore();
