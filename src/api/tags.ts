import { showToast } from '@/stores/toastNotificationStore';
import {
  apiDelete,
  apiPost,
  apiPut,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from './apiHelper';
import { Tag } from './responseTypes';

export const addTag = async (
  boardId: number,
  color: string,
  tagName: string
): Promise<Tag | undefined> => {
  const response = await apiPost(`/tags/board_${boardId}`, {
    text: tagName,
    color,
  });
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      return response.body;
    default:
      showToast('Ошибка при добавлении тега', 'error');
      return undefined;
  }
};

export const removeTag = async (tagId: number): Promise<boolean> => {
  const response = await apiDelete(`/tags/tag_${tagId}`);
  switch (response.status) {
    case HTTP_STATUS_CREATED:
    case HTTP_STATUS_OK:
      return true;
    default:
      showToast('Ошибка при удалении тега', 'error');
      return false;
  }
};

export const attachTagToCard = async (
  cardId: number,
  tagId: number
): Promise<boolean> => {
  const response = await apiPut(`/tags/card_${cardId}/tag_${tagId}`);
  switch (response.status) {
    case HTTP_STATUS_CREATED:
    case HTTP_STATUS_OK:
      return true;
    default:
      showToast('Ошибка при назначении тега', 'error');
      return false;
  }
};
export const removeTagFromCard = async (
  cardId: number,
  tagId: number
): Promise<boolean> => {
  const response = await apiDelete(`/tags/card_${cardId}/tag_${tagId}`);
  switch (response.status) {
    case HTTP_STATUS_CREATED:
    case HTTP_STATUS_OK:
      return true;
    default:
      showToast('Ошибка при удалении тега', 'error');
      return false;
  }
};
