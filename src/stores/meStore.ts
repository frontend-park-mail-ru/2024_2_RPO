import { getUserMe } from '@/api/users';
import { defineStore } from '@/jsxCore/hooks';
import { User } from '@/types/user';

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
    }
    return null;
  });
}, 0);
