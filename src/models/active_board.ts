import { Board } from "./board";
import { Card } from "./card";

export interface Column {
  title: string;
  cards: Card[];
}

export interface ActiveBoard {
  meta: Board;
  columns: Column[];
}
