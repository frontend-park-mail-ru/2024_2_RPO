import {
  Attachment,
  CardComment,
  CardDetails,
  CheckListField,
  User,
} from '@/types/types';
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
} from './apiHelper';
import {
  CardUserAssignRequest,
  CheckListFieldPostRequest,
  CheckListFieldPutRequest,
  CommentRequest,
} from './requestTypes';
import {
  AttachmentResponse,
  BoardResponse,
  CardDetailsResponse,
  CheckListFieldResponse,
  CommentResponse,
  SharedCardResponse,
  UserResponse,
} from './responseTypes';
import {
  decodeAttachment,
  decodeCardDetails,
  decodeCheckListField,
  decodeComment,
  decodeUser,
} from './decode';
import { showToast } from '@/stores/toastNotificationStore';

export const assignUser = async (
  cardId: number,
  nickname: string
): Promise<User | undefined> => {
  const payload: CardUserAssignRequest = {
    nickname,
  };
  const response = await apiPut(`/assignedUser/card_${cardId}`, payload);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      const body: UserResponse = response.body;
      return decodeUser(body);
    }
    default:
      showToast('Ошибка при назначении пользователя на карточку', 'error');
      return undefined;
  }
};

export const deassignUser = async (
  cardId: number,
  userId: number
): Promise<boolean> => {
  const response = await apiDelete(
    `/assignedUser/card_${cardId}/user_${userId}`
  );
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      return true;
    }
  }
  return false;
};

export const createComment = async (
  cardId: number,
  text: string
): Promise<CardComment | undefined> => {
  const payload: CommentRequest = { text };
  const response = await apiPost(`/comments/card_${cardId}`, payload);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      const body: CommentResponse = response.body;
      return decodeComment(body);
    }
  }
  return undefined;
};

export const editComment = async (
  commentId: number,
  text: string
): Promise<CardComment | undefined> => {
  const payload: CommentRequest = { text };
  const response = await apiPut(`/comments/comment_${commentId}`, payload);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      const body: CommentResponse = response.body;
      return decodeComment(body);
    }
  }
  return undefined;
};

export const deleteComment = async (commentId: number): Promise<boolean> => {
  const response = await apiDelete(`/comments/comment_${commentId}`);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      return true;
    }
  }
  return false;
};

export const addCheckListField = async (
  cardId: number,
  text: string
): Promise<CheckListField | undefined> => {
  const payload: CheckListFieldPostRequest = { title: text };
  const response = await apiPost(`/checkList/card_${cardId}`, payload);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      const body: CheckListFieldResponse = response.body;
      console.log(body);
      return decodeCheckListField(body);
    }
  }
  return undefined;
};

export const editCheckListField = async (
  fieldId: number,
  content: CheckListFieldPutRequest
): Promise<CheckListField | undefined> => {
  const response = await apiPatch(`/checkList/field_${fieldId}`, content);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      const body: CheckListFieldResponse = response.body;
      return decodeCheckListField(body);
    }
  }
  return undefined;
};

export const deleteCheckListField = async (
  fieldId: number
): Promise<boolean> => {
  const response = await apiDelete(`/checkList/field_${fieldId}`);
  switch (response.status) {
    case HTTP_STATUS_OK:
    case HTTP_STATUS_CREATED: {
      return true;
    }
  }
  return false;
};

export const getCardDetails = async (
  cardId: number
): Promise<CardDetails | undefined> => {
  const res = await apiGet(`cardDetails/card_${cardId}`);
  switch (res.status) {
    case HTTP_STATUS_OK: {
      const body: CardDetailsResponse = res.body;
      return decodeCardDetails(body);
    }
  }
  return undefined;
};

// Добавить вложение
export const addAttachment = async (
  cardId: number,
  file: File
): Promise<Attachment | undefined> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiPut(`/attachments/card_${cardId}`, formData);

  switch (response.status) {
    case HTTP_STATUS_CREATED:
    case HTTP_STATUS_OK:
      return decodeAttachment(response.body as AttachmentResponse);
    default:
      showToast('Ошибка при добавлении файла', 'error');
  }
};

export const deleteAttachment = async (
  attachmentId: number
): Promise<boolean> => {
  const response = await apiDelete(`/attachments/attachment_${attachmentId}`);
  switch (response.status) {
    case HTTP_STATUS_OK:
      return true;
    default:
      showToast('Ошибка при удалении вложения', 'error');
      return false;
  }
};

export const getCardByLink = async (
  cardUuid: string
): Promise<SharedCardResponse | undefined> => {
  const response = await apiGet(`/sharedCard/${cardUuid}`);
  switch (response.status) {
    case HTTP_STATUS_CREATED:
    case HTTP_STATUS_OK: {
      if (response.body.boardId !== undefined) {
        return {
          type: 'my',
          boardId: response.body.boardId,
          cardId: response.body.cardId,
        };
      } else {
        return {
          type: 'foreign',
          board: response.body.board as BoardResponse,
          card: response.body.card as CardDetailsResponse,
        };
      }
    }
    case HTTP_STATUS_NOT_FOUND:
      showToast('Карточка удалена или ссылка повреждена', 'error');
      return undefined;
    default:
      showToast('Неизвестная ошибка при получении карточки', 'error');
      return undefined;
  }
};
