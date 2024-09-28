import { Board } from "./board";
import { Card } from "./card";

export interface BoardColumn {
  id: number;
  title: string;
  cards: Card[];
}

export interface ActiveBoard extends Board {
  columns: BoardColumn[];
}
