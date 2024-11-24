import { CardComment, CardDetails, CheckListField } from '@/types/card';
import {
  CardDetailsResponse,
  CheckListFieldResponse,
  CommentResponse,
  MemberWithPermissionsResponse,
  UserResponse,
} from './responseTypes';
import { User, UserToBoard as Member } from '@/types/user';

export const decodeUser = (user: UserResponse): User => {
  return { ...user, pollQuestions: user.questions };
};

export const decodeMember = (r: MemberWithPermissionsResponse): Member => {
  return {
    user: decodeUser(r.user),
    addedBy: {
      id: r.addedBy.id,
      name: r.addedBy.name,
      email: r.addedBy.email,
      avatarImageUrl: r.addedBy.avatarImageUrl,
      pollQuestions: undefined,
    },
    role: r.role,
  };
};

export const decodeCheckListField = (
  field: CheckListFieldResponse
): CheckListField => {
  return { ...field, createdAt: new Date(field.createdAt) };
};

export const decodeComment = (comment: CommentResponse): CardComment => {
  return {
    ...comment,
    createdAt: new Date(comment.createdAt),
    createdBy: decodeUser(comment.createdBy),
  };
};

export const decodeCardDetails = (d: CardDetailsResponse): CardDetails => {
  return {
    checkList: d.checkList.map(decodeCheckListField),
    card: d.card,
    attachments: d.attachments,
    comments: d.comments.map(decodeComment),
    assignedUsers: d.assignedUsers.map(decodeUser),
  };
};
