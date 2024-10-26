import { getFlagRoutes } from '@/routes/routesFlag';
import { RouterFlags } from '@/routes/routesFlag';
import { defineStore } from '@/jsxCore/hooks';

// реагировать на изменения url
const handlerFunc = () => {
  const pathName = window.location.pathname;
  setRouterStore(getFlagRoutes(pathName));
};

window.addEventListener('hashchange', handlerFunc);
window.addEventListener('popstate', handlerFunc);

if (typeof window !== 'undefined') {
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
}

export const [useRouterStore, setRouterStore] = defineStore<RouterFlags>(
  'router',
  getFlagRoutes(window.location.pathname)
);
