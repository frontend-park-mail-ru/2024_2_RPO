import { Board } from '@/types/types';
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
