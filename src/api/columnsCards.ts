import { showToast } from '@/stores/toastNotificationStore';
import {
  apiDelete,
  apiPost,
  apiPut,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_INTERNAL_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
} from './apiHelper';
import { ColumnRequest } from './types';
import { BoardColumn } from '@/types/activeBoard';

export const deleteColumn = async (
  boardId: number,
  columnId: number
): Promise<void> => {
  try {
    const response = await apiDelete(
      `/columns/board_${boardId}/column_${columnId}`
    );
    switch (response.status) {
      case HTTP_STATUS_OK:
      case HTTP_STATUS_CREATED:
        showToast('Колонка успешно удалена', 'success');
        return;
      default:
        handleErrorResponse(response.status, response.body.text);
    }
  } catch (error) {
    showToast('Произошла ошибка при удалении колонки', 'error');
    console.error(error);
  }
};
export const updateColumn = async (
  boardId: number,
  columnId: number,
  columnData: ColumnRequest
): Promise<BoardColumn | void> => {
  try {
    const response = await apiPut(
      `/columns/board_${boardId}/column_${columnId}`,
      columnData
    );
    switch (response.status) {
      case HTTP_STATUS_OK:
      case HTTP_STATUS_CREATED:
        showToast('Успешно обновлено имя столбца', 'success');
        return response.body as BoardColumn;
      default:
        handleErrorResponse(response.status, response.body.text);
    }
  } catch (error) {
    showToast('Произошла ошибка при изменении колонки.', 'error');
    console.error(error);
  }
};
export const createColumn = async (
  boardId: number,
  columnData: ColumnRequest
): Promise<BoardColumn> => {
  try {
    const response = await apiPost(`/columns/board_${boardId}`, columnData);
    if (response.status === HTTP_STATUS_CREATED) {
      return response.body as BoardColumn;
    } else {
      handleErrorResponse(response.status, response.body.text);
    }
  } catch (error) {
    console.error(error);
  }
  showToast('Произошла ошибка при добавлении колонки', 'error');
  throw new Error('Error while creating column');
};
export const deleteCard = async (
  boardId: string,
  cardId: string
): Promise<void> => {
  try {
    const response = await apiDelete(`/cards/${boardId}/${cardId}`);
    if (response.status === HTTP_STATUS_OK) {
      showToast('Карточка успешно удалена.', 'success');
    } else {
      handleErrorResponse(response.status, response.body.text);
    }
  } catch (error) {
    showToast('Произошла ошибка при удалении карточки.', 'error');
    console.error(error);
  }
};
const handleErrorResponse = (status: number, message: string) => {
  switch (status) {
    case HTTP_STATUS_BAD_REQUEST:
      showToast(
        'Неверный запрос. Пожалуйста, проверьте введенные данные.',
        'error'
      );
      break;
    case HTTP_STATUS_UNAUTHORIZED:
      showToast('Необходима авторизация.', 'error');
      break;
    case HTTP_STATUS_FORBIDDEN:
      showToast('Доступ запрещен.', 'error');
      break;
    case HTTP_STATUS_NOT_FOUND:
      showToast('Ресурс не найден.', 'error');
      break;
    case HTTP_STATUS_INTERNAL_ERROR:
      showToast('Внутренняя ошибка сервера.', 'error');
      break;
    default:
      showToast(`Произошла ошибка: ${message}`, 'error');
  }
};
