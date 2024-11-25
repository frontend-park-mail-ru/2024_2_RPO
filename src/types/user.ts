import { PollQuestion } from '@/stores/csatStore';

export interface User {
  name: string;
  id: number;
  email: string;
  avatarImageUrl: string;
  pollQuestions: PollQuestion[] | undefined;
}

export interface UserToBoard {
  user: User;
  addedBy: User;
  role: string;
}
