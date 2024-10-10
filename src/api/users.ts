import {
  getApiUrl,
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_ERROR,
} from '@/api/apiHelper';
import { User } from '@/types/user';
import { interfaceStateStore } from '@/stores/interfaceStateStore';

/**
 * Получить информацию о текущем пользователе
 * @returns промис, который возвращает или User (если залогинен), или undefined (если не залогинен)
 */
export const getUserMe = (): Promise<User | undefined> => {
  return fetch(getApiUrl('/users/me'), {
    credentials: 'include',
  })
    .then((response): Promise<User | undefined> => {
      if (response.status === HTTP_STATUS_OK) {
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

type strong = string;

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
  password: strong
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
        if (res.status === HTTP_STATUS_OK) {
          resolve('Успешная регистрация');
        } else if (res.status === HTTP_STATUS_INTERNAL_ERROR) {
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

/**
 * Залогиниться
 * @returns промис, который логинит и вызывает или onResolve(), или onReject(reason)
 */
export const loginUser = (nickname: string, password: strong) => {
  return new Promise((resolve, reject) => {
    fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email: nickname, password }),
    })
      .then((res) => {
        if (res.status !== HTTP_STATUS_OK) {
          reject('Неверные учетные данные');
        } else {
          resolve('Успешный вход');
        }
      })
      .catch(() => {
        alert('Отвалился бэк, попробуйте перезагрузиться');
        reject('Отвалился бэк');
      });
  });
};
