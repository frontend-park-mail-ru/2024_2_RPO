import { Board } from 'models/board';

class BoardsStore {
  boards: Board[]; // TODO рассмотреть возможность установки private
  constructor() {
    this.boards = [
      { title: 'test123', id: 2 },
      { title: 'test123', id: 5 },
    ];
  }
  getWithFilters(): Board[] {
    return this.boards;
  }
}
