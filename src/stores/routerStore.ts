import { getFlagRoutes } from '@/routes/routesFlag';
import { RouterFlags } from '@/routes/routesFlag';
import { defineStore } from '@/jsxCore/hooks';
import { loadBoard } from './activeBoardStore';

// реагировать на изменения url
const handlerFunc = () => {
  const pathName = window.location.pathname;
  setRouterStore(getFlagRoutes(pathName));
  loadBoard(useRouterStore().boardId);
};

window.addEventListener('hashchange', handlerFunc);
window.addEventListener('popstate', handlerFunc);

const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = (state, title, url) => {
  const result = originalPushState.call(history, state, title, url);
  window.dispatchEvent(new Event('popstate'));
  return result;
};

history.replaceState = (state, title, url) => {
  const result = originalReplaceState.call(history, state, title, url);
  window.dispatchEvent(new Event('popstate'));
  return result;
};

export const goToUrl = (url: string) => {
  history.pushState(null, '', url);
};

export const [useRouterStore, setRouterStore] = defineStore<RouterFlags>(
  'router',
  {
    isHome: false,
    isApp: false,
    boardId: undefined,
  }
);
