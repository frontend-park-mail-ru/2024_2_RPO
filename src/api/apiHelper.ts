let apiRoot: string = '';
export let useMocks = false;

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
    return apiRoot + addr;
  }
  return apiRoot + '/' + addr;
};
const fetchApi = async (addr: string, method: string): Promise<IResponce> => {
  const response = await fetch(getApiUrl(addr), {
    credentials: 'include',
    method: method,
  });
  const contentType = response.headers.get('Content-Type') as string;
  let returnValue: any = undefined;
  if (contentType === 'application/json') {
    returnValue = await response.json();
  } else {
    returnValue = await response.text();
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
export const apiPost = async (addr: string) => {
  return fetchApi(addr, 'POST');
};
export const apiPatch = async (addr: string) => {
  return fetchApi(addr, 'PATCH');
};
export const apiPut = async (addr: string) => {
  return fetchApi(addr, 'PUT');
};
export const apiDelete = async (addr: string) => {
  return fetchApi(addr, 'DELETE');
};

export const setApiUrl = (apiRoot_: string) => {
  apiRoot = apiRoot_;
};
export const setUseMocks = (newUseMocks: boolean) => {
  useMocks = newUseMocks;
};

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_INTERNAL_ERROR = 500;
