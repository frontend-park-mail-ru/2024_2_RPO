import { PollResults, PollSubmit } from '@/types/poll';
import { apiGet, apiPost, HTTP_STATUS_OK } from './apiHelper';
import { showToast } from '@/stores/toastNotificationStore';

export const getPollResults = async (): Promise<PollResults> => {
  const resp = await apiGet('/poll/results');
  if (resp.status !== HTTP_STATUS_OK) {
    showToast('Ошибка при получении результатов опроса', 'error');
    throw new Error('Not OK get poll res');
  }
  return resp.body;
};

export const submitAnswer = async (ans: PollSubmit) => {
  console.log(await apiPost('/poll/submit', ans));
};
