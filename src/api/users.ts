import {
  getApiUrl,
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_ERROR,
  useMocks,
} from '@/api/apiHelper';
import { User } from '@/types/user';
import { userMeMock } from './mocks/user';

/**
 * Получить информацию о текущем пользователе
 * @returns промис, который возвращает или User (если залогинен), или undefined (если не залогинен)
 */
export const getUserMe = async (): Promise<User | undefined> => {
  if (useMocks) {
    return userMeMock;
  }
  try {
    const response = await fetch(getApiUrl('/users/me'), {
      credentials: 'include',
    });

    if (response.status === HTTP_STATUS_OK) {
      const json = await response.json();
      return { name: json.name, id: json.id, email: json.email };
    }
    return undefined;
  } catch {
    return undefined;
  }
};

/**
 * Зарегистрировать пользователя
 * @param nickname никнейм
 * @param email емайл
 * @param password пассворд
 * @returns промис, который вызовет фукнцию обратного вызова resolve() в случае успеха или reject(reason: string) в случае неудачной попытки логина
 */
export const registerUser = async (
  nickname: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetch(getApiUrl('/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: nickname, email, password }),
    });

    if (response.status === HTTP_STATUS_OK) {
      return 'Успешная регистрация';
    } else if (response.status === HTTP_STATUS_INTERNAL_ERROR) {
      alert('Ошибка на бэке');
      throw new Error('Ошибка на бэке');
    } else {
      throw new Error('Логин или email заняты');
    }
  } catch (error) {
    alert('Отвалился бэк, попробуйте перезагрузиться');
    throw error;
  }
};

/**
 * Выйти из аккаунта
 * @returns промис, который разлогинится и обновит интерфейс
 */
export const logout = async () => {
  const headers = await fetch(getApiUrl('/auth/logout'), {
    method: 'POST',
    credentials: 'include',
  });
  if (headers.status !== HTTP_STATUS_OK) {
    alert('Ошибка при logout');
  }
};

/**
 * Залогиниться
 * @returns промис, который логинит и вызывает или onResolve(), или onReject(reason)
 */
export const loginUser = async (nickname: string, password: string) => {
  try {
    const response = await fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email: nickname, password }),
    });

    if (response.status !== HTTP_STATUS_OK) {
      throw new Error('Неверные учетные данные');
    }

    return 'Успешный вход';
  } catch (error) {
    alert('Отвалился бэк, попробуйте перезагрузиться');
    throw error;
  }
};
