import { Board } from '@/types/board';
import { getApiUrl, HTTP_STATUS_OK } from '@/api/apiHelper';

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
    } else if (response.status === 404) {
      alert('Board not found');
    } else if (response.status === 401) {
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
