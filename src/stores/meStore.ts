import { getUserMe } from '@/api/users';
import { defineStore } from '@/jsxCore/hooks';
import { User } from '@/types/types';
import { goToUrl, useRouterStore } from './routerStore';

export const [useMeStore, setMeStore] = defineStore<User | undefined>(
  'me',
  undefined
);

export const updateMe = () => {
  setTimeout(() => {
    getUserMe().then((user) => {
      if (user !== undefined) {
        setMeStore(user);
      } else {
        setMeStore(undefined);
        if (useRouterStore().isApp) {
          goToUrl('/');
        }
      }
      return null;
    });
  }, 0);
};
