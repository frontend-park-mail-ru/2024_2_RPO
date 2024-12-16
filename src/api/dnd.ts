import { showToast } from '@/stores/toastNotificationStore';
import { apiPut, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from './apiHelper';
import { CardMoveRequest, ColumnMoveRequest } from './requestTypes';

export const moveCard = async (
  cardId: number,
  newColumnId: number,
  previousCardId: number,
  nextCardId: number
) => {
  const req: CardMoveRequest = {
    newColumnId: newColumnId,
    previousCardId: previousCardId,
    nextCardId: nextCardId,
  };
  const response = await apiPut(`/cardOrder/card_${cardId}`, req);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      showToast('Успешно перемещена карточка!', 'success');
      return;

    default:
      showToast('Неизвестная ошибка', 'error');
  }
};
export const moveColumn = async (
  columnId: number,
  nextColumnId: number,
  previousColumnId: number
) => {
  const req: ColumnMoveRequest = {
    nextColumnId: nextColumnId,
    previousColumnId: previousColumnId,
  };
  const response = await apiPut(`/columnOrder/column_${columnId}`, req);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      showToast('Успешно перемещена колонка!', 'success');
      return;

    default:
      showToast('Неизвестная ошибка', 'error');
  }
};
