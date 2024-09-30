import { getApiUrl } from './apiHelper.js';
import { User } from '/types/user.js';

export const getUserMe = (): Promise<User | undefined> => {
  return fetch(getApiUrl('/users/me'), {
    credentials: 'include',
  })
    .then((response): Promise<User | string | undefined> => {
      if (response.status === 200) {
        return response.json().then((json): User => {
          return { name: json.name, id: json.id };
        });
      } else if (response.status === 401) {
        return new Promise(() => {
          return undefined;
        });
      } else {
        alert('Get boards: Unexpected error');
        return new Promise(() => {
            return "Unexpected error";
          });
      }
    })
    .then((data) => {
      return data as User | undefined;
    });
};
