import { Board } from "./board";
import { Card } from "./card";

export interface Column {
  id: number;
  title: string;
  cards: Card[];
}

export interface ActiveBoard extends Board {
  columns: Column[];
}
