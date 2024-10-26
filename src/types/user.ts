export interface User {
  name: string;
  id: number;
  email: string;
}

export interface UserPermissions {
  canWrite: boolean;
  canShare: boolean;
  canInviteMembers: boolean;
  isAdmin: boolean;
}

export interface UserToBoard {
  user: User;
  permissions: UserPermissions;
  youCanKick: boolean; // Можете ли Вы выгнать этого пользователя из доски
}
