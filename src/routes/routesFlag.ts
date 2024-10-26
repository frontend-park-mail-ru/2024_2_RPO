export interface RouterFlags {
  isHome: boolean;
  isApp: boolean;
}

export const getFlagRoutes = (currentPath: string): RouterFlags => {
  console.log('Current path: ', currentPath);
  console.log('Я отработала');
  if (currentPath.startsWith('http')) throw new Error('fadfasdfasfd');
  // const matchBoard = currentPath.match(/\/app\/boardId_(\d+)/);
  // const boardId = matchBoard ? parseInt(matchBoard[1]) : null;

  // const matchMethod = currentPath.match(/\/app\/boardId_(\d+)\/method_(\w+)/);
  // const Method = matchMethod ? matchMethod[2] : null;

  return {
    isHome: !currentPath.startsWith('/app'),
    isApp: currentPath.startsWith('/app'),
  };
};
