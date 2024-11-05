export interface User {
  name: string;
  id: number;
  email: string;
  avatarImageUrl: string;
}

export interface UserToBoard {
  user: User;
  addedBy: User;
  role: string;
}
