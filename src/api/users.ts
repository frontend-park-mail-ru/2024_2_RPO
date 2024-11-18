import {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  useMocks,
  apiGet,
  apiPost,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
  apiPut,
} from '@/api/apiHelper';
import { User } from '@/types/user';
import { userMeMock } from './mocks/user';
import { showToast } from '@/stores/toastNotificationStore';
import { UserRequest, UserResponse } from './types';
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
      case HTTP_STATUS_OK: {
        const data: UserResponse = response.body;
        return {
          name: data.name,
          id: data.id,
          email: data.email,
          avatarImageUrl: data.avatarImageUrl,
        };
      }
      case HTTP_STATUS_UNAUTHORIZED:
        return undefined;
      default:
        showToast('Неожиданная ошибка', 'error');
    }
    return undefined;
  } catch {
    return undefined;
  }
};

type RegStatus =
  | 'ok'
  | 'error'
  | 'nickname_busy'
  | 'email_busy'
  | 'nickname_and_email_busy';

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
): Promise<RegStatus> => {
  try {
    const response = await apiPost('/auth/register', {
      name: nickname,
      email,
      password,
    });

    switch (response.status) {
      case HTTP_STATUS_OK:
        return 'ok';
      case HTTP_STATUS_BAD_REQUEST:
        return 'error';
      case HTTP_STATUS_CONFLICT:
        {
          switch (response.body.text) {
            case 'Nickname is busy':
              return 'nickname_busy';
            case 'Email is busy':
              return 'email_busy';
            case 'Email and nickname are busy':
              return 'nickname_and_email_busy';
          }
        }
        showToast('Неизвестная ошибка 409', 'error');
        throw new Error('unknown error');
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
export const loginUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await apiPost('/auth/login', {
      email,
      password,
    });

    switch (response.status) {
      case HTTP_STATUS_OK:
        return true;
      case HTTP_STATUS_UNAUTHORIZED:
        showToast('Неверные учётные данные', 'error');
        throw new Error('Неверные учетные данные');
      default:
        showToast('Неизвестная ошибка', 'error');
        throw new Error('Беды на бэке');
    }
  } catch {
    showToast('Неизвестная ошибка', 'error');
  }
  return false;
};

/**
 * Обновить аватар пользователя
 * @param avatar Файл изображения для аватара
 * @returns Промис, который возвращает User с обновленной аватаркой или ошибку
 */
export const updateUserAvatar = async (avatar: File): Promise<User> => {
  const formData = new FormData();
  formData.append('file', avatar);

  const response = await apiPut('/users/me/avatar', formData);

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
export const changeUserPassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const response = await apiPost('/auth/changePassword', {
    oldPassword,
    newPassword,
  });

  if (response.status !== HTTP_STATUS_OK) {
    if (response.status === HTTP_STATUS_BAD_REQUEST) {
      throw new Error('Некорректный запрос');
    }
    throw new Error('Ошибка при изменении пароля');
  }
};

export const updateUserProfile = async (
  newUserProfile: UserRequest
): Promise<UserResponse> => {
  try {
    const response = await apiPut('/users/me', newUserProfile);

    switch (response.status) {
      case HTTP_STATUS_OK: {
        const updatedUserProfile: UserResponse = response.body;
        return updatedUserProfile;
      }
      case HTTP_STATUS_BAD_REQUEST:
        showToast('Не прошло валидацию. Данные точно верные?', 'error');
        throw new Error('Неверные учетные данные');
      case HTTP_STATUS_CONFLICT:
        showToast('Никнейм или email заняты. Попробуйте другие', 'error');
        break;
      default:
        showToast('Неизвестная ошибка', 'error');
        throw new Error('Беды на бэке');
    }
  } catch {
    showToast('Неизвестная ошибка', 'error');
  }
  throw new Error('Неизвестная ошибка');
};
