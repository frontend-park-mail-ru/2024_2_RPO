import { Board } from '@/types/board';
import { defineStore } from '@/jsxCore/hooks';
import { getBoards } from '@/api/boards';

export const [useBoardsStore, setBoardsStore] = defineStore<Board[]>(
  'boards',
  []
);

setTimeout(() => {
  getBoards().then((newBoards: Board[]) => {
    setBoardsStore(newBoards);
  });
}, 0);
