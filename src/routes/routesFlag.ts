import { loadBoard } from '@/stores/activeBoardStore';
import { updateBoards } from '@/stores/boardsStore';
import { loadBoardInvitePreview, loadCardPreview } from '@/stores/previewStore';

export interface RouterFlags {
  isHome: boolean;
  isApp: boolean;
  isPoll: boolean;
  isPreview: boolean; // Является ли просмотром карточки по ссылке или просмотром приглашения
  isCardPreview: boolean;
  isBoardPreview: boolean;
  isKanban: boolean;
  isList: boolean;
  cardUuid: string | undefined;
  boardInviteUuid: string | undefined;
  isCsatResults: boolean;
  boardId: number | undefined;
}

export const getFlagRoutes = (currentPath: string): RouterFlags => {
  let boardId: number | undefined = undefined;
  let cardUuid: string | undefined;
  let boardInviteUuid: string | undefined;

  const isBoardPreview = currentPath.startsWith('/inviteBoard');
  const isCardPreview = currentPath.startsWith('/card');
  const isApp =
    currentPath.startsWith('/app') || isBoardPreview || isCardPreview;
  if (isApp) {
    if (currentPath.startsWith('/app/board_')) {
      boardId = parseInt(currentPath.slice('/app/board_'.length));
    } else {
      boardId = undefined;
    }
  }

  if (isApp && !(isCardPreview || isBoardPreview)) {
    updateBoards();
    loadBoard(boardId);
  }

  if (isCardPreview) {
    cardUuid = currentPath.slice('/card/'.length);
    loadCardPreview(cardUuid);
  }

  if (isBoardPreview) {
    boardInviteUuid = currentPath.slice('/inviteBoard/'.length);
    loadBoardInvitePreview(boardInviteUuid);
  }

  return {
    isHome: ['/login', '/register', '/'].indexOf(currentPath) !== -1,
    isCsatResults: currentPath === '/csat_results',
    isPoll: currentPath === '/csat_poll',
    isApp,
    boardId,
    boardInviteUuid,
    isKanban: currentPath.endsWith("kanban"),
    isList: currentPath.endsWith("list"),
    cardUuid,
    isPreview: isBoardPreview || isCardPreview,
    isBoardPreview,
    isCardPreview,
  };
};
