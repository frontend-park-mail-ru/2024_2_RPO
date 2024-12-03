import { User } from './user';

export type Card = StubCard | RealCard;

export interface StubCard {
  type: 'stub';
  id: number;
  height: number;
}

export interface RealCard {
  type: 'real';
  id: number;
  title: string;
  coverImageUrl?: string;
  deadline: Date | undefined;
  hasCheckList: boolean;
  hasAttachments: boolean;
  hasAssignedUsers: boolean;
}

export interface CardDetails {
  card: RealCard;
  checkList: CheckListField[];
  attachments: Attachment[];
  comments: CardComment[];
  assignedUsers: User[];
}

export interface CheckListField {
  id: number;
  title: string;
  createdAt: Date;
  isDone: boolean;
}

export interface Attachment {
  id: number;
  originalName: string;
  fileName: string;
}

export interface InviteLink {
  inviteLinkUuid: string;
}

export interface CardComment {
  id: number;
  text: string;
  isEdited: boolean;
  createdBy: User;
  createdAt: Date;
}
