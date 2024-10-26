import { getFlagRoutes } from "@/routes/routesFlag";

// реагировать на изменения url
const handlerFunc = () => {
    const pathName = window.location.pathname;
    getFlagRoutes(pathName);
}

window.addEventListener('hashchange', handlerFunc);
window.addEventListener('popstate', handlerFunc);

if (typeof window !== 'undefined') {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    
    history.pushState = (state, title, url) => {
        const result = originalPushState.call(this, state, title, url);
        window.dispatchEvent(new Event('popstate'));
        return result;
    };

    history.replaceState = (state, title, url) => {
        const result = originalReplaceState.call(this, state, title, url);
        window.dispatchEvent(new Event('popstate'));
        return result;
    };
}

handlerFunc();
