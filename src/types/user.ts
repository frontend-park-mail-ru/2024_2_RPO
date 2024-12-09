import { CsatQuestion } from "./poll";

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
