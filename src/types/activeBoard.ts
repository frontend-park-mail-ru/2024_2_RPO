import { Board } from './board';
import { Card } from './card';
import { UserPermissions, UserToBoard } from './user';

export interface BoardColumn {
  id: number;
  title: string;
  cards: Card[];
}

export interface ActiveBoard extends Board {
  columns: BoardColumn[];
  myPermissions: UserPermissions;
  users?: UserToBoard[];
}
