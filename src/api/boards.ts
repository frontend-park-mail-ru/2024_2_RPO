import { Board } from '/types/board.js';
import { getApiUrl } from './apiHelper.js';

/**
 * Получить все доступные пользователю доски
 * @returns Промис, который сходит на бэк и получит список доступных пользователю досок и вернёт их массивом
 */
export const getBoards = (): Promise<Board[]> => {
  return fetch(getApiUrl('/boards/my'), {
    credentials: 'include',
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((json: any[]) => {
          return json.map((el): Board => {
            return { id: el.id, title: el.name };
          });
        });
      } else if (response.status === 404) {
        alert('Board not found');
      } else if (response.status === 401) {
        alert('Get boards: User not authorized');
      } else {
        alert('Get boards: Unexpected error');
      }
    })
    .then((data) => {
      if (Array.isArray(data)) {
        return data as Board[];
      } else return [];
    });
};
