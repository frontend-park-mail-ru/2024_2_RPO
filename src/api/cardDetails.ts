import { CardComment, CardDetails, CheckListField } from '@/types/card';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} from './apiHelper';
import {
  CardUserAssignRequest,
  CheckListFieldPostRequest,
  CheckListFieldPutRequest,
  CommentRequest,
} from './requestTypes';
import {
  CardDetailsResponse,
  CheckListFieldResponse,
  CommentResponse,
  UserResponse,
} from './responseTypes';
import {
  decodeCardDetails,
  decodeCheckListField,
  decodeComment,
  decodeUser,
} from './decode';
import { User } from '@/types/user';

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
  }
  return undefined;
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
      return decodeCheckListField(body);
    }
  }
  return undefined;
};

export const editCheckListField = async (
  fieldId: number,
  content: CheckListFieldPutRequest
): Promise<CheckListField | undefined> => {
  const response = await apiPut(`/checkList/field_${fieldId}`, content);
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
