export const activeBoardMock = {
  id: 0,
  title: 'Моя любимая доска',
  columns: [
    {
      id: 1,
      title: 'Задачи',
      cards: [
        { id: 228, title: 'Пример задачи, для которой не задана обложка' },
        {
          id: 1337,
          title: 'Пример задачи, для которой задана обложка',
          coverImageUrl: '/static/image/lada_vesta.png',
        },
      ],
    },
  ],
};