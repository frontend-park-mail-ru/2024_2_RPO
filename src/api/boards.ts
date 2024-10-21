import { Board } from '@/types/board';
import {
  getApiUrl,
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
    const response = await fetch(getApiUrl('/boards/my'), {
      credentials: 'include',
    });

    if (response.status === HTTP_STATUS_OK) {
      const json = await response.json();
      const boards: Board[] = json.map((el: any): Board => {
        return { id: el.id, title: el.name };
      });
      return boards;
    } else if (response.status === HTTP_STATUS_NOT_FOUND) {
      alert('Board not found');
    } else if (response.status === HTTP_STATUS_UNAUTHORIZED) {
      alert('Get boards: User not authorized');
    } else {
      alert('Get boards: Unexpected error');
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
    const response = await fetch(getApiUrl(`/boards/${boardId}/allContent`), {
      credentials: 'include',
    });

    if (response.status === HTTP_STATUS_OK) {
      const json = await response.json();
      return json;
    } else if (response.status === HTTP_STATUS_NOT_FOUND) {
      alert('Доска не найдена');
    } else if (response.status === HTTP_STATUS_UNAUTHORIZED) {
      alert('Проблемы с аутентификацией, перезайдите пж');
    } else {
      alert('Неизвестная ошибка');
    }
  } catch (error) {
    console.error('Error fetching boards:', error);
    alert('An error occurred while fetching boards');
    // return [];
  }
  throw new Error('Some error');
};
