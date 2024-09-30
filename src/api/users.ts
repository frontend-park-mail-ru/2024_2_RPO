import { getApiUrl } from './apiHelper.js';
import { User } from '/types/user.js';

export const getUserMe = (): Promise<User | undefined> => {
  return fetch(getApiUrl('/users/me'), {
    credentials: 'include',
  })
    .then((response): Promise<User | undefined> => {
      if (response.status === 200) {
        return response.json().then((json): User => {
          return { name: json.name, id: json.id };
        });
      }
      return Promise.resolve(undefined);
    })
    .catch(() => {
      return undefined;
    });
};
