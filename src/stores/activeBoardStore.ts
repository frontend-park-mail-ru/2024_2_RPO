import { ActiveBoard } from "models/active_board";

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

export const getActiveBoard = () => {
  return activeBoard;
};
