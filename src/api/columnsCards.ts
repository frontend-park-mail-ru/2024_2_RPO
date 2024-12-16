import { showToast } from '@/stores/toastNotificationStore';
import {
  apiDelete,
  apiPatch,
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
import { CardResponse } from './responseTypes';
import { BoardColumn, Card } from '@/types/types';
import { CardPatchRequest, CardRequest, ColumnRequest } from './requestTypes';
import { decodeCard } from './decode';

export const deleteColumn = async (columnId: number): Promise<void> => {
  try {
    const response = await apiDelete(`/columns/column_${columnId}`);
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
  columnId: number,
  columnData: ColumnRequest
): Promise<BoardColumn> => {
  try {
    const response = await apiPut(`/columns/column_${columnId}`, columnData);
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
  throw new Error('Неизвестная ошибка');
};

export const createColumn = async (
  boardId: number,
  columnData: ColumnRequest
): Promise<BoardColumn | undefined> => {
  try {
    const response = await apiPost(`/columns/board_${boardId}`, columnData);
    switch (response.status) {
      case HTTP_STATUS_CREATED:
      case HTTP_STATUS_OK:
        showToast('Успешно создана колонка', 'success');
        return response.body as BoardColumn;

      default:
        handleErrorResponse(response.status, response.body.text);
        return undefined;
    }
  } catch (error) {
    console.error(error);
  }
  showToast('Произошла ошибка при добавлении колонки', 'error');
  throw new Error('Error while creating column');
};

export const createCard = async (
  boardId: number,
  data: CardRequest
): Promise<Card | undefined> => {
  try {
    const response = await apiPost(`/cards/board_${boardId}`, data);
    switch (response.status) {
      case HTTP_STATUS_OK:
      case HTTP_STATUS_CREATED:
        showToast('Успешно создана карточка', 'success');
        return decodeCard(response.body as CardResponse);
      default:
        handleErrorResponse(response.status, response.body.text);
        return undefined;
    }
  } catch (error) {
    showToast('Произошла ошибка при создании карточки.', 'error');
    console.error(error);
  }
  throw new Error('Неизвестная ошибка');
};

export const updateCard = async (
  cardId: number,
  data: CardPatchRequest
): Promise<Card | undefined> => {
  try {
    const response = await apiPatch(`/cards/card_${cardId}`, data);
    switch (response.status) {
      case HTTP_STATUS_OK:
      case HTTP_STATUS_CREATED:
        showToast('Успешно изменена карточка', 'success');
        return decodeCard(response.body as CardResponse);
      default:
        handleErrorResponse(response.status, response.body.text);
        return undefined;
    }
  } catch (error) {
    showToast('Произошла ошибка при изменении карточки.', 'error');
    console.error(error);
  }
  throw new Error('Неизвестная ошибка');
};

export const deleteCard = async (cardId: number): Promise<void> => {
  try {
    const response = await apiDelete(`/cards/card_${cardId}`);
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
