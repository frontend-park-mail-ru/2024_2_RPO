export interface BoardContentResponse {
  boardInfo: BoardInfoResponse;
  allColumns: ColumnResponse[];
  allCards: CardResponse[];
}

export interface ColumnResponse {
  id: number;
  title: string;
}

export interface CardResponse {
  id: number;
  title: string;
  description: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardInfoResponse {
  id: number;
  name: string;
  description: string;
  //TODO background
}

export interface BoardResponse {
  id: number;
  name: string;
  description: string;
  backgroundImageUrl: string;
  createdAt: string;
  updatedAt: string;
}
