import { getUserMe } from '@/api/users';
import { defineStore } from '@/jsxCore/hooks';
import { User } from '@/types/user';
import { goToUrl, useRouterStore } from './routerStore';

export const [useMeStore, setMeStore] = defineStore<User>('me', {
  email: 'Загрузка',
  id: 12345,
  name: 'Загрузка',
});

setTimeout(() => {
  getUserMe().then((user) => {
    console.log('User', user);
    if (user !== undefined) {
      setMeStore(user);
    } else {
      if (useRouterStore().isApp) {
        goToUrl('/');
      }
    }
    return null;
  });
}, 0);
