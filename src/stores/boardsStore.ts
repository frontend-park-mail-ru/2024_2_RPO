import { Board } from '@/types/board';
import { defineStore } from '@/jsxCore/hooks';
import { getBoards } from '@/api/boards';

export const [useBoardsStore, setBoardsStore] = defineStore<Board[]>(
  'boards',
  []
);

export const updateBoards = () => {
  getBoards().then((newBoards) => {
    setBoardsStore(newBoards);
  });
};
