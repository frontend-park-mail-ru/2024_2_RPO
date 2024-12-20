import { CsatQuestion } from '@/types/types';

export interface BoardContentResponse {
  myRole: 'viewer' | 'editor' | 'editor_chief' | 'admin';
  boardInfo: BoardResponse;
  allColumns: ColumnResponse[];
  allCards: CardResponse[];
  allTags: Tag[];
}

export interface Tag {
  id: number;
  text: string;
  color: string;
}

export interface ColumnResponse {
  id: number;
  title: string;
}

export interface CardResponse {
  id: number;
  title: string;
  coverImageUrl: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  hasCheckList: boolean;
  hasAttachments: boolean;
  hasAssignedUsers: boolean;
  hasComments: boolean;
  cardUuid: string;
}

export interface BoardResponse {
  id: number;
  name: string;
  description: string;
  backgroundImageUrl: string;
  createdAt: string;
  updatedAt: string;
  myInviteLinkUuid?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  avatarImageUrl: string;
  pollQuestions?: CsatQuestion[];
}

export interface UserPermissionsResponse {
  user: UserResponse;
  addedAt: string;
  role: 'viewer' | 'editor' | 'editor_chief' | 'admin';
  updatedAt: string;
  addedBy: UserResponse;
  updatedBy: UserResponse;
}

export interface MemberWithPermissionsResponse {
  user: UserResponse;
  addedAt: string;
  role: string;
  updatedAt: string;
  updatedBy: UserResponse;
  addedBy: UserResponse;
}

export interface CheckListFieldResponse {
  id: number;
  title: string;
  createdAt: string;
  isDone: boolean;
}

export interface AttachmentResponse {
  id: number;
  originalName: string;
  fileName: string;
  createdAt: string;
}

export interface CommentResponse {
  id: number;
  text: string;
  isEdited: boolean;
  createdBy: UserResponse;
  createdAt: string;
}

export interface CardDetailsResponse {
  card: CardResponse;
  checkList: CheckListFieldResponse[];
  attachments: AttachmentResponse[];
  comments: CommentResponse[];
  assignedUsers: UserResponse[];
}

export type SharedCardResponse =
  | MySharedCardResponse
  | ForeignSharedCardResponse;

export interface MySharedCardResponse {
  type: 'my';
  boardId: number;
  cardId: number;
}

export interface ForeignSharedCardResponse {
  type: 'foreign';
  board: BoardResponse;
  card: CardDetailsResponse;
}
