import { Board } from '@/types/board';
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
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
import {
  BoardContentResponse,
  BoardInfoResponse,
  BoardResponse,
} from './responseTypes';
import { showToast } from '@/stores/toastNotificationStore';

// Получить все доски пользователя
export const getBoards = async (): Promise<Board[]> => {
  if (useMocks) {
    return myBoardsMock;
  }

  try {
    const response = await apiGet('/boards/my');
    const json: BoardInfoResponse[] = await response.body;

    if (response.status === HTTP_STATUS_OK) {
      return json.map(
        (el: BoardInfoResponse): Board => ({
          id: el.id,
          title: el.name,
          lastUpdate: new Date(el.updatedAt),
          lastVisit: new Date(el.updatedAt), // TODO избавиться от недоразумения
          backgroundImageUrl: el.backgroundImageUrl,
        })
      );
    } else {
      handleErrors(response.status, 'Получение списка досок');
    }

    return [];
  } catch (error) {
    console.error('Error fetching boards:', error);
    showToast('Ошибка при получении досок', 'error');
    return [];
  }
};

// Получить содержание доски
export const getBoardContent = async (
  boardId: number
): Promise<ActiveBoard> => {
  if (useMocks) return activeBoardMock;

  try {
    const response = await apiGet(`/cards/board_${boardId}/allContent`);
    if (response.status === HTTP_STATUS_OK) {
      const boardContentResponse: BoardContentResponse = response.body;

      const columnIndex = new Map<number, number>();
      const columns: BoardColumn[] = boardContentResponse.allColumns.map(
        (column, idx) => {
          columnIndex.set(column.id, idx);
          return {
            ...column,
            cards: [], // инициализация пустым массивом для типа BoardColumn
          };
        }
      );
      boardContentResponse.allCards.forEach((card) => {
        const colIdx = columnIndex.get(card.columnId) ?? 0;
        columns[colIdx].cards.push(card);
      });

      return {
        id: boardContentResponse.boardInfo.id,
        title: boardContentResponse.boardInfo.name,
        columns, // обновленный массив columns
        myRole: boardContentResponse.myRole,
        lastUpdate: new Date(boardContentResponse.boardInfo.updatedAt),
        lastVisit: new Date(boardContentResponse.boardInfo.updatedAt),
        backgroundImageUrl: boardContentResponse.boardInfo.backgroundImageUrl,
      };
    } else {
      handleErrors(response.status, 'Get board content');
    }
  } catch (error) {
    console.error('Error fetching board content:', error);
    showToast('An error occurred while fetching board content', 'error');
  }
  throw new Error('Error at getBoardContent');
};

// Создать новую доску
export const createBoard = async (boardName: string): Promise<Board> => {
  const response = await apiPost('/boards', { name: boardName });
  try {
    if (
      response.status === HTTP_STATUS_OK ||
      response.status === HTTP_STATUS_CREATED
    ) {
      const boardInfo: BoardResponse = response.body;
      return {
        id: boardInfo.id,
        title: boardInfo.name,
        lastUpdate: new Date(boardInfo.updatedAt),
        lastVisit: new Date(boardInfo.updatedAt), // TODO избавиться от недоразумения
        backgroundImageUrl: boardInfo.backgroundImageUrl,
      };
    } else {
      throw new Error('Unexpected error in createBoard');
    }
  } catch (err) {
    showToast('Неизвестная ошибка при создании доски', 'error');
    throw err;
  }
};

// Изменить информацию о доске
export const updateBoard = async (
  boardId: number,
  name: string,
  description: string
): Promise<Board> => {
  const response = await apiPut(`/boards/board_${boardId}`, {
    name,
    description,
  });

  if (response.status === HTTP_STATUS_OK) {
    const updatedBoard: BoardResponse = response.body;
    return {
      id: updatedBoard.id,
      title: updatedBoard.name,
      lastUpdate: new Date(updatedBoard.updatedAt),
      lastVisit: new Date(updatedBoard.updatedAt), //TODO избавиться от неоднозначности
      backgroundImageUrl: updatedBoard.backgroundImageUrl,
    };
  } else {
    handleErrors(response.status, 'Update board');
    throw new Error('Ошибка при обновлении доски');
  }
};

// Удалить доску
export const deleteBoard = async (boardId: number): Promise<void> => {
  const response = await apiDelete(`/boards/board_${boardId}`);

  if (response.status !== HTTP_STATUS_OK) {
    handleErrors(response.status, 'Delete board');
    throw new Error('Ошибка при удалении доски');
  }
};

// Установить изображение заднего фона
export const setBoardBackgroundImage = async (boardId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiPut(
    `/boards/board_${boardId}/backgroundImage`,
    formData
  );

  if (response.status !== HTTP_STATUS_OK) {
    handleErrors(response.status, 'Set board background image');
    throw new Error('Ошибка при изменении фона доски');
  }
  return response;
};

// Функция для обработки ошибок
const handleErrors = (status: number, action: string) => {
  switch (status) {
    case HTTP_STATUS_NOT_FOUND:
      showToast(
        `${action}: Запрашиваемый элемент не найден или не существует`,
        'error'
      );
      break;
    case HTTP_STATUS_UNAUTHORIZED:
      showToast(`${action}: Войдите в аккаунт сперва!`, 'error');
      break;
    case HTTP_STATUS_FORBIDDEN:
      showToast(`${action}: У Вас нет прав на это действие`, 'error');
      break;
    default:
      showToast(`${action}: Неизвестная ошибка`, 'error');
      break;
  }
};
