import { Board, UserToBoard } from '@/types/types';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
} from './apiHelper';
import { showToast } from '@/stores/toastNotificationStore';
import { BoardResponse, MemberWithPermissionsResponse } from './responseTypes';
import { decodeBoard, decodeMember } from './decode';

export const getBoardPermissions = async (
  boardId: number
): Promise<UserToBoard[]> => {
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

export const removeMember = async (boardId: number, userId: number) => {
  const response = await apiDelete(
    `/userPermissions/board_${boardId}/user_${userId}`
  );
  switch (response.status) {
    case HTTP_STATUS_OK: {
      return;
    }
    default:
      showToast('Ошибка при удалении участника', 'error');
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

export const createInviteLink = async (
  boardId: number
): Promise<string | undefined> => {
  const response = await apiPut(`/inviteLink/board_${boardId}`);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      return response.body.inviteLinkUuid as string;
    default:
      showToast('Ошибка при задании ссылки-приглашения', 'error');
      return;
  }
};

export const deleteInviteLink = async (boardId: number): Promise<boolean> => {
  const response = await apiDelete(`/inviteLink/board_${boardId}`);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      return true;
    default:
      showToast('Ошибка при задании ссылки-приглашения', 'error');
      return false;
  }
};

export const fetchInviteLink = async (
  inviteLinkUuid: string
): Promise<Board | undefined> => {
  const response = await apiGet(`/joinBoard/${inviteLinkUuid}`);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      return decodeBoard(response.body as BoardResponse);
    case HTTP_STATUS_NOT_FOUND:
      showToast(
        'Возможно, ссылка-приглашение была удалена или повреждена',
        'error'
      );
      return undefined;
    default:
      showToast(
        'Неизвестная ошибка при получении приглашения на доску',
        'error'
      );
      return undefined;
  }
};

export const joinInviteLink = async (
  inviteLinkUuid: string
): Promise<Board | undefined> => {
  const response = await apiPost(`/joinBoard/${inviteLinkUuid}`);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED:
      return decodeBoard(response.body as BoardResponse);
    case HTTP_STATUS_NOT_FOUND:
      showToast(
        'Возможно, ссылка-приглашение была удалена или повреждена',
        'error'
      );
      return undefined;
    default:
      showToast(
        'Неизвестная ошибка при получении приглашения на доску',
        'error'
      );
      return undefined;
  }
};
