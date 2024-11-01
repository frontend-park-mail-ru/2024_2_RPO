export interface RouterFlags {
  isHome: boolean;
  isApp: boolean;
  boardId: number | undefined;
}

export const getFlagRoutes = (currentPath: string): RouterFlags => {
  console.log('Current path: ', currentPath);
  let boardId: number | undefined = undefined;
  if (currentPath.startsWith('/app')) {
    if (currentPath.startsWith('/app/board_')) {
      boardId = parseInt(currentPath.slice('/app/board_'.length));
    }
  }

  return {
    isHome: ['/login', '/register', '/'].indexOf(currentPath) !== -1,
    isApp: currentPath.startsWith('/app'),
    boardId,
  };
};
