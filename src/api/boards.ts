// import { Board } from '@/types/board';
// import {
//   apiGet,
//   apiPost,
//   HTTP_STATUS_CREATED,
//   HTTP_STATUS_FORBIDDEN,
//   HTTP_STATUS_NOT_FOUND,
//   HTTP_STATUS_OK,
//   HTTP_STATUS_UNAUTHORIZED,
//   useMocks,
// } from '@/api/apiHelper';
// import { ActiveBoard } from '@/types/activeBoard';
// import { activeBoardMock } from './mocks/activeBoard';
// import { myBoardsMock } from './mocks/myBoards';
// import { BoardContentResponse, BoardResponse } from './types';
// import { showToast } from '@/stores/toastNotificationStore';

// /**
//  * Получить все доступные пользователю доски
//  * @returns Промис, который сходит на бэк и получит список доступных пользователю досок и вернёт их массивом
//  */
// export const getBoards = async (): Promise<Board[]> => {
//   if (useMocks) {
//     return myBoardsMock;
//   }
//   try {
//     const response = await apiGet('boards/my');
//     const json = await response.body;

//     switch (response.status) {
//       case HTTP_STATUS_OK: {
//         const boards: Board[] = json.map((el: any): Board => {
//           return { id: el.id, title: el.name };
//         });
//         return boards;
//       }
//       case HTTP_STATUS_NOT_FOUND:
//         alert('Board not found');
//         break;
//       case HTTP_STATUS_UNAUTHORIZED:
//       case HTTP_STATUS_FORBIDDEN:
//         alert('Get boards: User not authorized');
//         break;
//       default:
//         alert('Неизвестная ошибка');
//         break;
//     }

//     return [];
//   } catch (error) {
//     console.error('Error fetching boards:', error);
//     alert('An error occurred while fetching boards');
//     return [];
//   }
// };

// export const getBoardContent = async (
//   boardId: number
// ): Promise<ActiveBoard> => {
//   if (useMocks) {
//     return activeBoardMock;
//   }
//   try {
//     const response = await apiGet(`/boards/${boardId}/allContent`);

//     switch (response.status) {
//       case HTTP_STATUS_OK: {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         const boardContentResponse: BoardContentResponse=response.body
//         const boardContent: ActiveBoard={
//           columns: [],
//           myRole: "admin",
//           id: 0,
//           title: ''
//         }
//         return boardContent
//       }
//       case HTTP_STATUS_NOT_FOUND:
//         alert('Get board content: Board not found');
//         break;
//       case HTTP_STATUS_UNAUTHORIZED:
//       case HTTP_STATUS_FORBIDDEN:
//         alert('Get board content: User not authorized');
//         break;
//       default:
//         alert('Get board content: Unexpected error');
//         break;
//     }
//   } catch (error) {
//     console.error('Error fetching boards:', error);
//     alert('An error occurred while fetching boards');
//   }
//   throw new Error('Error at getBoardContent');
// };

// /**
//  * Создаёт новую доску
//  * @param boardName Имя новой доски
//  * @returns Новую доску
//  * @throws Выдаёт ошибку, если что-то пошло не так
//  */
// export const createBoard = async (boardName: string): Promise<Board> => {
//   const response = await apiPost('/boards', { name: boardName });
//   try {
//     switch (response.status) {
//       case HTTP_STATUS_OK:
//       case HTTP_STATUS_CREATED: {
//         const boardInfo: BoardResponse = response.body;
//         const board: Board = {
//           id: boardInfo.id,
//           title: boardInfo.name,
//         };
//         return board;
//       }

//       default:
//         throw new Error('Ошибка при POST createBoard: неожиданная ошибка');
//     }
//   } catch (err) {
//     showToast('Неизвестная ошибка при создании доски', 'error');
//     throw err;
//   }
// };


import { Board } from '@/types/board';
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPutFormData,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
  useMocks,
} from '@/api/apiHelper';
import { ActiveBoard, BoardColumn } from '@/types/activeBoard';
import { activeBoardMock } from './mocks/activeBoard';
import { myBoardsMock } from './mocks/myBoards';
import { BoardContentResponse, BoardResponse } from './types';
import { showToast } from '@/stores/toastNotificationStore';

// Получить все доски пользователя
export const getBoards = async (): Promise<Board[]> => {
  if (useMocks) return myBoardsMock;

  try {
    const response = await apiGet('boards/my');
    const json = await response.body;

    if (response.status === HTTP_STATUS_OK) {
      return json.map((el: any) => ({ id: el.id, title: el.name }));
    } else {
      handleErrors(response.status, 'Get boards');
    }

    return [];
  } catch (error) {
    console.error('Error fetching boards:', error);
    alert('An error occurred while fetching boards');
    return [];
  }
};

// Получить содержание доски
export const getBoardContent = async (boardId: number): Promise<ActiveBoard> => {
  if (useMocks) return activeBoardMock;

  try {
    const response = await apiGet(`/boards/${boardId}/allContent`);
    if (response.status === HTTP_STATUS_OK) {
      const boardContentResponse: BoardContentResponse = response.body;

      const columns: BoardColumn[] = boardContentResponse.allColumns.map((column) => ({
        ...column,
        cards: [], // инициализация пустым массивом для типа BoardColumn
      }));

      return {
        id: boardContentResponse.boardInfo.id,
        title: boardContentResponse.boardInfo.name,
        columns, // обновленный массив columns с пустыми cards
        myRole: boardContentResponse.myRole,
      };
    } else {
      handleErrors(response.status, 'Get board content');
    }
  } catch (error) {
    console.error('Error fetching board content:', error);
    alert('An error occurred while fetching board content');
  }
  throw new Error('Error at getBoardContent');
};

// Создать новую доску
export const createBoard = async (boardName: string): Promise<Board> => {
  const response = await apiPost('/boards', { name: boardName });
  try {
    if (response.status === HTTP_STATUS_OK || response.status === HTTP_STATUS_CREATED) {
      const boardInfo: BoardResponse = response.body;
      return { id: boardInfo.id, title: boardInfo.name };
    } else {
      throw new Error('Unexpected error in createBoard');
    }
  } catch (err) {
    showToast('Неизвестная ошибка при создании доски', 'error');
    throw err;
  }
};

// Изменить информацию о доске
export const updateBoard = async (boardId: string, name: string, description: string): Promise<Board> => {
  const response = await apiPut(`/boards/${boardId}`, { name, description });

  if (response.status === HTTP_STATUS_OK) {
    return response.body;
  } else {
    handleErrors(response.status, 'Update board');
    throw new Error('Ошибка при обновлении доски');
  }
};

// Удалить доску
export const deleteBoard = async (boardId: string): Promise<void> => {
  const response = await apiDelete(`/boards/${boardId}`);

  if (response.status !== HTTP_STATUS_OK) {
    handleErrors(response.status, 'Delete board');
    throw new Error('Ошибка при удалении доски');
  }
};

// Установить изображение заднего фона
export const setBoardBackgroundImage = async (boardId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('background', file);

  const response = await apiPutFormData(`/boards/${boardId}/backgroundImage`, formData);
  
  if (response.status !== HTTP_STATUS_OK) {
    handleErrors(response.status, 'Set board background image');
    throw new Error('Ошибка при изменении фона доски');
  }
};

// Функция для обработки ошибок
const handleErrors = (status: number, action: string) => {
  switch (status) {
    case HTTP_STATUS_NOT_FOUND:
      alert(`${action}: Board not found`);
      break;
    case HTTP_STATUS_UNAUTHORIZED:
    case HTTP_STATUS_FORBIDDEN:
      alert(`${action}: User not authorized`);
      break;
    default:
      alert(`${action}: Unexpected error`);
      break;
  }
};
