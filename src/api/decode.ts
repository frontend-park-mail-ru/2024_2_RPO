import {
  Attachment,
  CardComment,
  CardDetails,
  CheckListField,
  RealCard,
  User,
  Board,
  ActiveBoard,
  BoardColumn,
  UserToBoard,
} from '@/types/types';
import {
  AttachmentResponse,
  BoardContentResponse,
  BoardResponse,
  CardDetailsResponse,
  CardResponse,
  CheckListFieldResponse,
  CommentResponse,
  MemberWithPermissionsResponse,
  UserResponse,
} from './responseTypes';

export const decodeUser = (user: UserResponse): User => {
  return { ...user, pollQuestions: user.pollQuestions };
};

export const decodeCard = (card: CardResponse): RealCard => {
  return {
    ...card,
    linkUuid: card.cardUuid,
    type: 'real',
    deadline: card.deadline ? new Date(card.deadline) : undefined,
  };
};

export const decodeMember = (r: MemberWithPermissionsResponse): UserToBoard => {
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
    card: decodeCard(d.card),
    attachments: d.attachments,
    comments: d.comments.map(decodeComment),
    assignedUsers: d.assignedUsers.map(decodeUser),
  };
};

export const decodeAttachment = (r: AttachmentResponse): Attachment => {
  return {
    ...r,
  };
};

export const decodeBoard = (r: BoardResponse): Board => {
  return {
    ...r,
    title: r.name,
    lastUpdate: new Date(r.updatedAt),
    lastVisit: new Date(r.updatedAt),
    myInviteLinkUuid: r.myInviteLinkUuid,
  };
};

export const decodeActiveBoard = (r: BoardContentResponse): ActiveBoard => {
  const colIndex = new Map<number, number>();
  const columns: BoardColumn[] = r.allColumns.map((cr, idx) => {
    colIndex.set(cr.id, idx);
    return { cards: [], id: cr.id, isStub: false, title: cr.title };
  });
  r.allCards.forEach((card) => {
    columns[colIndex.get(card.columnId) as number].cards.push(decodeCard(card));
  });
  return {
    columns: columns,
    board: decodeBoard(r.boardInfo),
    myRole: r.myRole,
  };
};
