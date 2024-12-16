export interface UserRequest {
  name: string;
  email: string;
}

export interface ColumnRequest {
  title: string;
}

export interface CardRequest {
  title: string;
  columnId: number;
}

export interface CardPatchRequest {
  title?: string;
  isDone?: boolean;
  deadline?: string | null;
}

export interface CardUserAssignRequest {
  nickname: string;
}

export interface CommentRequest {
  text: string;
}

export interface CheckListFieldPutRequest {
  title: string;
  isDone: boolean;
  previousFieldId?: number;
  nextFieldId?: number;
}

export interface CheckListFieldPostRequest {
  title: string;
}

export interface CardMoveRequest {
  newColumnId: number;
  previousCardId: number;
  nextCardId: number;
}

export interface ColumnMoveRequest {
  previousColumnId: number;
  nextColumnId: number;
}
