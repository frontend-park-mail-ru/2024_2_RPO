export interface User {
  name: string;
  id: number;
  email: string;
  avatarImageUrl: string;
  pollQuestions: CsatQuestion[] | undefined;
}

export interface UserToBoard {
  user: User;
  addedBy: User;
  role: string;
}
export interface CsatQuestion {
  id: number;
  text: string;
  type: 'answer_text' | 'answer_rating';
}

export interface PollSubmit {
  questionId: number;
  rating?: number;
  text?: string;
}

export interface TextResult {
  question: string;
  text: string[];
}

export interface RatingResult {
  question: string;
  rating: string;
}

export interface PollResults {
  ratingResults: RatingResult[];
  textResults: TextResult[];
}

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
export interface Board {
  id: number;
  title: string;
  lastVisit: Date;
  lastUpdate: Date;
  backgroundImageUrl: string;
  myInviteLinkUuid: string | undefined;
}

export interface BoardColumn {
  id: number;
  isStub: boolean; // Надо ли для этой колонки рендерить содержимое (нужно для Drag-n-Drop)
  title: string;
  cards: Card[];
}

export interface ActiveBoard {
  board: Board;
  columns: BoardColumn[];
  myRole: 'viewer' | 'editor' | 'editor_chief' | 'admin';
}
