import { ActiveBoard } from '@/types/activeBoard';
import { defineStore } from '@/jsxCore/hooks';
import { activeBoardMock } from '@/api/mocks/activeBoard';
import { getBoardContent } from '@/api/boards';
import { useMocks } from '@/api/apiHelper';

export const [useActiveBoardStore, setActiveBoardStore] = defineStore<
  ActiveBoard | undefined
>('activeBoardStore', useMocks ? activeBoardMock : undefined);

export const loadBoard = (
  boardId: number | undefined,
  refetch: boolean = false
) => {
  if (boardId === undefined) {
    setActiveBoardStore(undefined);
    return;
  } else {
    const abStore = useActiveBoardStore();
    if (abStore !== undefined) {
      if (abStore.id === boardId && !refetch) {
        return;
      }
    }
    getBoardContent(boardId).then((board) => {
      setActiveBoardStore(board);
    });
  }
};
