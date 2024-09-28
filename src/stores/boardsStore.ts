import { Board } from "models/board";

const boards: Board[] = [
  { title: "test123", id: 2 },
  { title: "test123", id: 5 },
];

const favoriteOnly: boolean = false;

export const boardsStore_getWithFilters = () => {
  return boards;
};
