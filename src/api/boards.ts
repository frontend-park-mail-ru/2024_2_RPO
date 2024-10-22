import { Board } from '@/types/board';
import {
  apiGet,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
  useMocks,
} from '@/api/apiHelper';
import { ActiveBoard } from '@/types/activeBoard';
import { activeBoardMock } from './mocks/activeBoard';

/**
 * Получить все доступные пользователю доски
 * @returns Промис, который сходит на бэк и получит список доступных пользователю досок и вернёт их массивом
 */
export const getBoards = async (): Promise<Board[]> => {
  try {
    const response = await apiGet('boards/my');
    const json = await response.body;

    switch (response.status) {
      case HTTP_STATUS_OK:
        {
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
    const json = await response.body;

    switch (response.status) {
      case HTTP_STATUS_OK:
        return json;
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
