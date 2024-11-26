import { boardUrl, userUrl, pollUrl } from '@/config';
let csrfToken: string = '';
export const useMocks =
  boardUrl.toString() === 'mock' || userUrl.toString() === 'mock';

interface IResponce {
  status: number;
  body: any;
  contentType: string;
}

/**
 * Функция получает полный URL ресурса в API
 * @param addr адрес ресурса в API. Например, /users/me
 * @returns Например, 'https://example.com/api/v2/users/me'
 */
const getApiUrl = (addr: string): string => {
  if (addr.startsWith('/')) {
    addr = addr.slice(1);
  }
  if (addr.startsWith('users') || addr.startsWith('auth')) {
    const ret = userUrl + '/' + addr;
    console.log(ret);
    return ret;
  } else if (addr.startsWith('poll')) {
    return pollUrl + '/' + addr;
  } else {
    return boardUrl + '/' + addr;
  }
};

const fetchApi = async (
  addr: string,
  method: string,
  requestBody?: any,
  retry: boolean = false
): Promise<IResponce> => {
  const requestHeaders = new Headers();
  const requestOptions: RequestInit = {
    credentials: 'include',
    method: method,
  };
  requestHeaders.set('X-CSRF-Token', csrfToken);
  if (requestBody instanceof FormData) {
    requestOptions.body = requestBody;
  } else if (requestBody !== undefined) {
    requestOptions.body = JSON.stringify(requestBody);
    requestHeaders.set('Content-Type', MIME_TYPE_JSON);
  }
  requestOptions.headers = requestHeaders;

  let response: Response;
  try {
    response = await fetch(getApiUrl(addr), requestOptions);
  } catch (responseWithError) {
    if (responseWithError instanceof Response) {
      response = responseWithError;
      console.warn(addr, 'response has status', responseWithError.status);
    } else {
      throw responseWithError;
    }
  }
  const contentType = response.headers.get('Content-Type') as string;
  const text = await response.text();

  const returnValue = contentType.includes(MIME_TYPE_JSON)
    ? JSON.parse(text)
    : text;

  const newCsrfToken = response.headers.get('x-csrf-token');
  if (newCsrfToken !== null) {
    csrfToken = newCsrfToken;
  } else {
    if (retry) {
      console.warn('No CSRF token provided at csrf retry request');
    }
    console.warn('No CSRF token provided');
  }
  if (
    response.status === HTTP_STATUS_FORBIDDEN &&
    JSON.stringify(returnValue).toLowerCase().indexOf('csrf') !== -1 &&
    !retry
  ) {
    // Повторить запрос, если сбился CSRF-токен
    await fetchApi('/users/me', 'GET', undefined, true);
    return await fetchApi(addr, method, requestBody, true);
  }
  return {
    status: response.status,
    body: returnValue,
    contentType,
  };
};

export const apiGet = async (addr: string) => {
  return fetchApi(addr, 'GET');
};
export const apiPost = async (addr: string, body?: any) => {
  return fetchApi(addr, 'POST', body);
};
export const apiPatch = async (addr: string, body?: any) => {
  return fetchApi(addr, 'PATCH', body);
};
export const apiPut = async (addr: string, body?: any) => {
  return fetchApi(addr, 'PUT', body);
};
export const apiDelete = async (addr: string) => {
  return fetchApi(addr, 'DELETE');
};

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_CONFLICT = 409;
export const HTTP_STATUS_INTERNAL_ERROR = 500;
export const MIME_TYPE_JSON = 'application/json';
