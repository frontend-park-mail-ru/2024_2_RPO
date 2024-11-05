import { getBoardPermissions } from '@/api/members';
import { defineStore } from '@/jsxCore/hooks';
import { UserToBoard } from '@/types/user';
import { useActiveBoardStore } from './activeBoardStore';
import { ActiveBoard } from '@/types/activeBoard';

export const [useMembersStore, setMembersStore] = defineStore<UserToBoard[]>(
  'members',
  []
);

export const updateMembers = () => {
  setMembersStore([]);
  const ab = useActiveBoardStore() as ActiveBoard;
  getBoardPermissions(ab.id).then((newStore) => {
    setMembersStore(newStore);
  });
};
