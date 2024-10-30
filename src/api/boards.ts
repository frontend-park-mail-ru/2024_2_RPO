import { Board } from '@/types/board';
import {
  apiGet,
  apiPost,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
  useMocks,
} from '@/api/apiHelper';
import { ActiveBoard } from '@/types/activeBoard';
import { activeBoardMock } from './mocks/activeBoard';
import { myBoardsMock } from './mocks/myBoards';
import { BoardContentResponse, BoardResponse } from './types';
import { showToast } from '@/stores/toastNotificationStore';

/**
 * Получить все доступные пользователю доски
 * @returns Промис, который сходит на бэк и получит список доступных пользователю досок и вернёт их массивом
 */
export const getBoards = async (): Promise<Board[]> => {
  if (useMocks) {
    return myBoardsMock;
  }
  try {
    const response = await apiGet('boards/my');
    const json = await response.body;

    switch (response.status) {
      case HTTP_STATUS_OK: {
        const boards: Board[] = json.map((el: any): Board => {
          return { id: el.id, title: el.name };
        });
        return boards;
      }
      case HTTP_STATUS_NOT_FOUND:
        alert('Board not found');
        break;
      case HTTP_STATUS_UNAUTHORIZED:
      case HTTP_STATUS_FORBIDDEN:
        alert('Get boards: User not authorized');
        break;
      default:
        alert('Неизвестная ошибка');
        break;
    }

    return [];
  } catch (error) {
    console.error('Error fetching boards:', error);
    alert('An error occurred while fetching boards');
    return [];
  }
};

export const getBoardContent = async (
  boardId: number
): Promise<ActiveBoard> => {
  if (useMocks) {
    return activeBoardMock;
  }
  try {
    const response = await apiGet(`/boards/${boardId}/allContent`);

    switch (response.status) {
      case HTTP_STATUS_OK: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const boardContentResponse: BoardContentResponse=response.body
        const boardContent: ActiveBoard={
          columns: [],
          myRole: "admin",
          id: 0,
          title: ''
        }
        return boardContent
      }
      case HTTP_STATUS_NOT_FOUND:
        alert('Get board content: Board not found');
        break;
      case HTTP_STATUS_UNAUTHORIZED:
      case HTTP_STATUS_FORBIDDEN:
        alert('Get board content: User not authorized');
        break;
      default:
        alert('Get board content: Unexpected error');
        break;
    }
  } catch (error) {
    console.error('Error fetching boards:', error);
    alert('An error occurred while fetching boards');
  }
  throw new Error('Error at getBoardContent');
};

/**
 * Создаёт новую доску
 * @param boardName Имя новой доски
 * @returns Новую доску
 * @throws Выдаёт ошибку, если что-то пошло не так
 */
export const createBoard = async (boardName: string): Promise<Board> => {
  const response = await apiPost('/boards', { name: boardName });
  try {
    switch (response.status) {
      case HTTP_STATUS_OK:
      case HTTP_STATUS_CREATED: {
        const boardInfo: BoardResponse = response.body;
        const board: Board = {
          id: boardInfo.id,
          title: boardInfo.name,
        };
        return board;
      }

      default:
        throw new Error('Ошибка при POST createBoard: неожиданная ошибка');
    }
  } catch (err) {
    showToast('Неизвестная ошибка при создании доски', 'error');
    throw err;
  }
};
