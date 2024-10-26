import { ActiveBoard } from '@/types/activeBoard';
import { defineStore } from '@/jsxCore/hooks';
import { activeBoardMock } from '@/api/mocks/activeBoard';
import { getBoardContent } from '@/api/boards';

export const [useActiveBoardStore, setActiveBoardStore] =
  defineStore<ActiveBoard>('activeBoardStore', activeBoardMock);

export const loadBoard = (boardId: number) => {
  getBoardContent(boardId).then((board) => {
    setActiveBoardStore(board);
  });
};
