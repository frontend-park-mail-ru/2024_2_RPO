import { ActiveBoard } from '@/types/activeBoard';
import { defineStore } from '@/jsxCore/hooks';
import { activeBoardMock } from '@/api/mocks/activeBoard';

export const [useActiveBoardStore, setActiveBoardStore] =
  defineStore<ActiveBoard>('activeBoardStore', activeBoardMock);
