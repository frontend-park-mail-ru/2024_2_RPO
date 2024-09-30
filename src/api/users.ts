import { getApiUrl } from './apiHelper.js';
import { User } from '/types/user.js';
import { interfaceStateStore } from '/stores/interfaceStateStore.js';

/**
 * Получить информацию о текущем пользователе
 * @returns промис, который возвращает или User (если залогинен), или undefined (если не залогинен)
 */
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

/**
 * Зарегистрировать пользователя
 * @param nickname никнейм
 * @param email емайл
 * @param password пассворд
 * @returns промис, который вызовет фукнцию обратного вызова resolve() в случае успеха или reject(reason: string) в случае неудачной попытки логина
 */
export const registerUser = (
  nickname: string,
  email: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    fetch(getApiUrl('/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: nickname, email, password }),
    })
      .then((res) => {
        if (res.status === 200) {
          resolve('Успешная регистрация');
        } else if (res.status === 500) {
          alert('Ошибка на бэке');
          reject('Ошибка на бэке');
        } else {
          reject('Логин или email заняты');
        }
      })
      .catch(() => {
        alert('Отвалился бэк, попробуйте перезагрузиться');
        reject('Отвалился бэк');
      });
  });
};

/**
 * Выйти из аккаунта
 * @returns промис, который разлогинится и обновит интерфейс
 */
export const logout = () => {
  return fetch(getApiUrl('/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  }).then(() => {
    if (interfaceStateStore !== undefined) {
      interfaceStateStore.me = undefined;
    }
    history.pushState(null, '', '/');
    interfaceStateStore?.updateRegAndApp();
  });
};
