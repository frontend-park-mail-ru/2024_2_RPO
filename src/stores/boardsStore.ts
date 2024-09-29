import { Board } from 'types/board';

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
  addBoard(title: string): void {
    if (title.length < 3) {
      console.log('Too short name for title');
      return;
    }
    //TODO сходить в базу
    this.boards.push({ title, id: 5 });
  }
}

export const boardsStore = new BoardsStore();
