import {routes} from './routes';

export interface RouterFlags {
    boardId: number | null;
    Method: string | null;
    isHome: boolean;
    isLogin: boolean;
    isRegister: boolean;
    isApp: boolean;
    isBoard: boolean;
    isMethod: boolean;
    isBoardSettings: boolean;
    isProfile: boolean;
    isSearch: boolean;
}

export const getFlagRoutes = (currentPath: string): RouterFlags => {
    const matchBoard = currentPath.match(/\/app\/boardId_(\d+)/);
    const boardId = matchBoard ? parseInt(matchBoard[1]) : null;

    const matchMethod = currentPath.match(/\/app\/boardId_(\d+)\/method_(\w+)/);
    const Method = matchMethod ? matchMethod[2] : null;

    return {
        boardId,
        Method, 
        isHome: !currentPath.startsWith('/app'),
        isLogin: currentPath === routes.login,
        isRegister: currentPath === routes.register,
        isApp: currentPath === routes.app,
        isBoard: !! matchBoard,
        isMethod: !! matchMethod,
        isBoardSettings: currentPath === routes.boardSettings,
        isProfile: currentPath === routes.profile,
        isSearch: currentPath === routes.search,
    }
}
