import { Board } from './board';
import { Card } from './card';
import { UserToBoard } from './user';

export interface BoardColumn {
  id: number;
  title: string;
  cards: Card[];
}

export interface ActiveBoard extends Board {
  columns: BoardColumn[];
  myRole: 'viewer' | 'editor' | 'editor_chief' | 'admin';
  users?: UserToBoard[];
}
