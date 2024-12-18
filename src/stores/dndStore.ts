import { defineStore } from '@/jsxCore/hooks';
import { BoardColumn, RealCard } from '@/types/types';

type DndType = undefined | CardDndType | ColumnDndType;
type ColumnDndType = {
  type: 'column';
  activeColumn: BoardColumn;
  activeColumnIdx: number;
  offset: [x: number, y: number];
};
interface CardDndType {
  type: 'card';
  offset: [x: number, y: number];
  cardData: RealCard;
  prevColIdx: number;
  started: boolean;
}

export const [useDndStore, setDndStore] = defineStore<DndType>(
  'dnd_store',
  undefined
);

// Мапа, в которой хранятся clientHeight карточек.
// Ключ - ID карточки
export const cardHeights = new Map<number, number>();

// Высоты заголовков колонки.
// Это нужно для того, чтобы колонки с длинным названием работали корректно.
// Ключ - порядковый индекс колонки
export const colHeaderHeights = new Map<number, number>();

// Этот лок нужен только для того, чтобы предотвратить действия, когда где-то редактируется текст.
// В других целях она не должна использоваться
export let editLock = false;

export const setEditLock = (newValue: boolean) => {
  editLock = newValue;
};
