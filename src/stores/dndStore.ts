import { defineStore } from '@/jsxCore/hooks';
import { RealCard } from '@/types/card';

type DndType = undefined | CardDndType | ColumnDndType;
type ColumnDndType = never;
interface CardDndType {
  type: 'card';
  offset: [x: number, y: number];
  cardData: RealCard;
  prevColIdx: number;
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
