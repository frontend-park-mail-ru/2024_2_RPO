import {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  useMocks,
  apiGet,
  apiPutFormData,
  apiPost,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
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
    const response = await apiGet('/users/me');

    switch (response.status) {
      case HTTP_STATUS_OK:
        return {
          name: response.body.name,
          id: response.body.id,
          email: response.body.email,
        };
      case HTTP_STATUS_UNAUTHORIZED:
        return undefined;
      default:
        alert('Неожиданная ошибка');
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
    const response = await apiPost('/auth/register', {
      name: nickname,
      email,
      password,
    });

    switch (response.status) {
      case HTTP_STATUS_OK:
        return 'Успешная регистрация';
      case HTTP_STATUS_CONFLICT:
        //TODO определить, занят логин, мыло или оба
        throw new Error('Логин или email заняты');
      default:
        throw new Error('Неизвестная ошибка');
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
  const response = await apiPost('/auth/logout');
  switch (response.status) {
    case HTTP_STATUS_OK:
      return;
    case HTTP_STATUS_UNAUTHORIZED:
      alert('Вы уже разлогинены, Вам мало?');
      break;
    default:
      alert('Беды на бэке');
  }
};

/**
 * Залогиниться
 * @returns промис, который логинит и вызывает или onResolve(), или onReject(reason)
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiPost('/auth/login', {
      email,
      password,
    });

    switch (response.status) {
      case HTTP_STATUS_OK:
        return;
      case HTTP_STATUS_UNAUTHORIZED:
        alert('Неверные креды');
        throw new Error('Неверные учетные данные');
      default:
        alert('Беды на бэке');
        throw new Error('Беды на бэке');
    }
  } catch {
    alert('Неизвестная ошибка');
  }
};

/**
 * Обновить аватар пользователя
 * @param avatar Файл изображения для аватара
 * @returns Промис, который возвращает User с обновленной аватаркой или ошибку
 */
export const updateUserAvatar = async (avatar: File): Promise<User> => {
  const formData = new FormData();
  formData.append('avatar', avatar);
  
  const response = await apiPutFormData('/users/me/avatar', formData);
  
  if (response.status === HTTP_STATUS_OK) {
    return response.body as User;
  } else {
    throw new Error('Ошибка при обновлении аватарки');
  }
};

/**
 * Изменить пароль пользователя
 * @param oldPassword Текущий пароль пользователя
 * @param newPassword Новый пароль пользователя
 * @returns Промис, который возвращает сообщение об успехе или ошибке
 */
export const changeUserPassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  const response = await apiPost('/auth/changePassword', { oldPassword, newPassword });

  if (response.status !== HTTP_STATUS_OK) {
    if (response.status === HTTP_STATUS_BAD_REQUEST) {
      throw new Error('Некорректный запрос');
    }
    throw new Error('Ошибка при изменении пароля');
  }
};