import { ActiveBoard } from '@/types/activeBoard';

export const activeBoardMock: ActiveBoard = {
  id: 0,
  title: 'Моя любимая доска',
  columns: [
    {
      id: 1,
      isStub: false,
      title: 'Задачи',
      cards: [
        {
          type: 'real',
          id: 228,
          title: 'Пример задачи, для которой не задана обложка',
          deadline: undefined,
          hasAssignedUsers: false,
          hasAttachments: false,
          hasCheckList: false,
        },
        {
          type: 'real',
          id: 1337,
          title: 'Пример задачи, для которой задана обложка',
          coverImageUrl: '/static/img/lada_vesta.png',
          deadline: undefined,
          hasAssignedUsers: false,
          hasAttachments: false,
          hasCheckList: false,
        },
      ],
    },
  ],
  myRole: 'admin',
  lastVisit: new Date(Date.UTC(2004, 7, 10)),
  lastUpdate: new Date(Date.UTC(2024, 7, 10)),
  backgroundImageUrl: '/static/img/backgroundPicture.png',
};
