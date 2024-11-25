import { User } from './user';

export interface Card {
  id: number;
  title: string;
  coverImageUrl?: string;
  deadline: Date | undefined;
}

export interface CardDetails {
  card: Card;
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
