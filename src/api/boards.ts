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
import {
  BoardContentResponse,
  BoardInfoResponse,
  BoardResponse,
} from './types';
import { showToast } from '@/stores/toastNotificationStore';

// Получить все доски пользователя
export const getBoards = async (): Promise<Board[]> => {
  if (useMocks) return myBoardsMock;

  try {
    const response = await apiGet('boards/my');
    const json: BoardInfoResponse[] = await response.body;

    if (response.status === HTTP_STATUS_OK) {
      return json.map(
        (el: BoardInfoResponse): Board => ({ id: el.id, title: el.name })
      );
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
export const getBoardContent = async (
  boardId: number
): Promise<ActiveBoard> => {
  if (useMocks) return activeBoardMock;

  try {
    const response = await apiGet(`/boards/${boardId}/allContent`);
    if (response.status === HTTP_STATUS_OK) {
      const boardContentResponse: BoardContentResponse = response.body;

      const columns: BoardColumn[] = boardContentResponse.allColumns.map(
        (column) => ({
          ...column,
          cards: [], // инициализация пустым массивом для типа BoardColumn
        })
      );

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
    if (
      response.status === HTTP_STATUS_OK ||
      response.status === HTTP_STATUS_CREATED
    ) {
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
export const updateBoard = async (
  boardId: string,
  name: string,
  description: string
): Promise<Board> => {
  const response = await apiPut(`/boards/${boardId}`, { name, description });

  if (response.status === HTTP_STATUS_OK) {
    const updatedBoard: BoardResponse = response.body;
    return { id: updatedBoard.id, title: updatedBoard.name };
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
export const setBoardBackgroundImage = async (
  boardId: string,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('background', file);

  const response = await apiPutFormData(
    `/boards/${boardId}/backgroundImage`,
    formData
  );

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
