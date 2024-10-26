import { Board } from '@/types/board';
import { defineStore } from '@/jsxCore/hooks';

export const [useBoardsStore, setBoardsStore] = defineStore<Board[]>(
  'boards',
  []
);
