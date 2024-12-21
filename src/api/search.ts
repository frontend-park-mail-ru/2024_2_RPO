import { SearchRes } from '@/stores/searchResultStore';
import { apiPost, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from './apiHelper';
import { showToast } from '@/stores/toastNotificationStore';

export const searchInElastic = async (
  query: string
): Promise<SearchRes[] | undefined> => {
  const response = await apiPost('/search', { title: query });
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      return response.body;
    default:
      showToast('Ошибка при поиске', 'error');
      return undefined;
  }
};
