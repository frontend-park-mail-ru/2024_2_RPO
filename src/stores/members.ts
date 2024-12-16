import { getBoardPermissions } from '@/api/members';
import { defineStore } from '@/jsxCore/hooks';
import { useActiveBoardStore } from './activeBoardStore';
import { ActiveBoard, UserToBoard } from '@/types/types';

export const [useMembersStore, setMembersStore] = defineStore<UserToBoard[]>(
  'members',
  []
);

export const updateMembers = () => {
  setMembersStore([]);
  const ab = useActiveBoardStore() as ActiveBoard;
  getBoardPermissions(ab.board.id).then((newStore) => {
    setMembersStore(newStore);
  });
};
