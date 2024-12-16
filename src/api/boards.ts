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
import { ActiveBoard, Board, BoardColumn } from '@/types/types';
import { activeBoardMock } from './mocks/activeBoard';
import { myBoardsMock } from './mocks/myBoards';
import { BoardContentResponse, BoardResponse } from './responseTypes';
import { showToast } from '@/stores/toastNotificationStore';
import { decodeActiveBoard, decodeBoard, decodeCard } from './decode';

// Получить все доски пользователя
export const getBoards = async (): Promise<Board[]> => {
  if (useMocks) {
    return myBoardsMock;
  }

  try {
    const response = await apiGet('/boards/my');
    const json: BoardResponse[] = await response.body;

    if (response.status === HTTP_STATUS_OK) {
      return json.map((el: BoardResponse): Board => decodeBoard(el));
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
            isStub: false,
            cards: [], // инициализация пустым массивом для типа BoardColumn
          };
        }
      );
      boardContentResponse.allCards.forEach((card) => {
        const colIdx = columnIndex.get(card.columnId) ?? 0;
        columns[colIdx].cards.push(decodeCard(card));
      });

      return decodeActiveBoard(boardContentResponse);
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
      return decodeBoard(boardInfo);
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
    return decodeBoard(updatedBoard);
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
