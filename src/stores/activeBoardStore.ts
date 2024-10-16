import { ActiveBoard } from '@/types/activeBoard';
import { activeBoardMock } from '@/api/mocks/activeBoard';

class ActiveBoardStore {
  activeBoard: ActiveBoard; // TODO рассмотреть возможность установки private
  constructor() {
    this.activeBoard = activeBoardMock;
  }
}

export const activeBoardStore = new ActiveBoardStore();
