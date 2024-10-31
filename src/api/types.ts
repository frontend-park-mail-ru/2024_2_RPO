export interface BoardContentResponse {
  myRole: "viewer" | "editor" | "editor_chief" | "admin";
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
  backgroundImageUrl: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardInfoResponse {
  id: number;
  name: string;
  description: string;
  backgroundImageUrl: string; 
  createdAt: string;
  updatedAt: string;
}

export interface BoardResponse {
  id: number;
  name: string;
  description: string;
  backgroundImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  avatarImageUrl: string;
}

export interface UserPermissionsResponse {
  user: UserResponse;
  addedAt: string;
  role: "viewer" | "editor" | "editor_chief" | "admin";
  updatedAt: string;
  addedBy: UserResponse;
  updatedBy: UserResponse;
}