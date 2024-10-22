import { ActiveBoard } from '@/types/activeBoard';
import { defineStore } from '@/jsxCore/hooks';
import { getBoardContent } from '@/api/boards';

export const [useActiveBoardStore, setActiveBoardStore] =
  defineStore<ActiveBoard>('activeBoardStore', {
    columns: [],
    id: -228,
    title: 'Загрузка...',
  });

export const loadBoard = (boardId: number) => {
  getBoardContent(boardId).then((board) => {
    setActiveBoardStore(board);
  });
};
