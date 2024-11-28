import { defineStore } from '@/jsxCore/hooks';

type DndType = undefined | CardDndType | ColumnDndType;
type ColumnDndType = never;
interface CardDndType {
  type: 'card';
  offset: [x: number, y: number];
}

export const [useDndStore, setDndStore] = defineStore<DndType>(
  'dnd_store',
  undefined
);
