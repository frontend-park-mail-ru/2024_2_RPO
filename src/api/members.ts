import { UserToBoard as Member } from '@/types/user';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_OK,
} from './apiHelper';
import { showToast } from '@/stores/toastNotificationStore';
import { MemberWithPermissionsResponse } from './responseTypes';
import { decodeMember } from './decode';

export const getBoardPermissions = async (
  boardId: number
): Promise<Member[]> => {
  const response = await apiGet(`/userPermissions/board_${boardId}`);
  switch (response.status) {
    case HTTP_STATUS_OK: {
      const data = response.body as MemberWithPermissionsResponse[];
      return data.map(decodeMember);
    }
    default:
      showToast('Ошибка при получении прав всех участников', 'error');
      return [];
  }
};

export const addMember = async (
  boardId: number,
  nickname: string
): Promise<Member> => {
  const response = await apiPost(`/userPermissions/board_${boardId}`, {
    nickname,
  });
  switch (response.status) {
    case HTTP_STATUS_OK: {
      const data = response.body as MemberWithPermissionsResponse;
      return decodeMember(data);
    }
    case HTTP_STATUS_CONFLICT:
      showToast('Похоже, участник уже есть', 'error');
      throw new Error('Неизвестная ошибка');
    default:
      showToast('Ошибка при добавлении участника', 'error');
      throw new Error('Неизвестная ошибка');
  }
};

export const removeMember = async (boardId: number, userId: number) => {
  const response = await apiDelete(
    `/userPermissions/board_${boardId}/user_${userId}`
  );
  switch (response.status) {
    case HTTP_STATUS_OK: {
      return;
    }
    default:
      showToast('Ошибка при изгнании участника', 'error');
      throw new Error('Неизвестная ошибка');
  }
};

export const updateMember = async (
  boardId: number,
  userId: number,
  newRole: string
) => {
  const response = await apiPut(
    `/userPermissions/board_${boardId}/user_${userId}`,
    { newRole }
  );
  switch (response.status) {
    case HTTP_STATUS_OK: {
      const data = response.body as MemberWithPermissionsResponse;
      return decodeMember(data);
    }
    default:
      showToast('Ошибка при изменении прав участника', 'error');
      throw new Error('Неизвестная ошибка');
  }
};
