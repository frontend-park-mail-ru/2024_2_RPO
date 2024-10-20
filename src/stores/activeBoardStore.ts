import { ActiveBoard } from '@/types/activeBoard';
import { defineStore } from '@/jsxCore/hooks';

export const [useActiveBoardStore, setActiveBoardStore] =
  defineStore<ActiveBoard>('activeBoardStore', {
    columns: [],
    id: 0,
    title: 'Моя самая любимая доска',
  });
