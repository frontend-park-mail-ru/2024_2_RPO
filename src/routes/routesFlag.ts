import { loadBoard } from '@/stores/activeBoardStore';
import { updateBoards } from '@/stores/boardsStore';

export interface RouterFlags {
  isHome: boolean;
  isApp: boolean;
  isPoll: boolean;
  isCsatResults: boolean;
  boardId: number | undefined;
}

export const getFlagRoutes = (currentPath: string): RouterFlags => {
  let boardId: number | undefined = undefined;
  if (currentPath.startsWith('/app')) {
    if (currentPath.startsWith('/app/board_')) {
      boardId = parseInt(currentPath.slice('/app/board_'.length));
    } else {
      boardId = undefined;
    }
  }
  if (currentPath.startsWith('/app')) {
    updateBoards();
    loadBoard(boardId);
  }

  return {
    isHome: ['/login', '/register', '/'].indexOf(currentPath) !== -1,
    isCsatResults: currentPath === '/csat_results',
    isPoll: currentPath === '/csat_poll',
    isApp: currentPath.startsWith('/app'),
    boardId,
  };
};
