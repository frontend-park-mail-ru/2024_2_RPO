import { ActiveBoard, Column } from "models/active_board.js";
import { Card } from "models/card.js";

const activeBoard: ActiveBoard = {
  meta: {
    id: 0,
    title: "Моя любимая доска",
  },
  columns: [
    {
      title: "Задачи",
      cards: [
        { title: "Пример задачи, для которой не задана обложка" },
        {
          title: "Пример задачи, для которой задана обложка",
          cover_url: "/static/image/lada_vesta.png",
        },
      ],
    },
  ],
};

export const activeBoardStore_get = (): ActiveBoard => {
  return activeBoard;
};

export const activeBoardStore_addCard = (card: Card, column: Column) => {
  column.cards.push(card);
  //TODO сходить в базу
  //TODO перерисовка
};

export const activeBoardStore_removeCard = (cardToRemove: Card) => {
  activeBoard.columns.forEach((column) => {
    column.cards = column.cards.filter((card) => card != cardToRemove);
  });
  //TODO сходить в базу
  //TODO перерисовка
};
