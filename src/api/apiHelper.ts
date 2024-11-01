let apiRoot: string = '';
let csrfToken: string = '';
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

const fetchApi = async (
  addr: string,
  method: string,
  requestBody?: any
): Promise<IResponce> => {
  const requestHeaders = new Headers();
  const requestOptions: RequestInit = {
    credentials: 'include',
    method: method,
  };
  requestHeaders.set('X-CSRF-Token', csrfToken);
  console.log('CSRF token: ', csrfToken);
  if (requestBody !== undefined) {
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
  let returnValue: any;

  if (contentType.includes(MIME_TYPE_JSON)) {
    returnValue = JSON.parse(text);
  } else {
    returnValue = text;
  }
  console.log(response.headers);
  const newCsrfToken = response.headers.get('x-csrf-token');
  if (newCsrfToken !== null) {
    csrfToken = newCsrfToken;
  } else {
    console.error('No CSRF token provided');
  }
  return {
    status: response.status,
    body: returnValue,
    contentType,
  };
};

/**
 * Выполняет PUT-запрос с использованием formData
 * @param addr адрес ресурса в API
 * @param formData объект FormData с данными для отправки
 * @returns Promise с ответом, содержащим статус, тело и тип контента
 */
export const apiPutFormData = async (
  addr: string,
  formData: FormData
): Promise<IResponce> => {
  const requestHeaders = new Headers({});
  const requestOptions: RequestInit = {
    credentials: 'include',
    method: 'PUT',
    headers: requestHeaders,
    body: formData,
  };

  const response = await fetch(getApiUrl(addr), requestOptions);
  const contentType = response.headers.get('Content-Type') as string;
  let returnValue: any = undefined;

  if (contentType === MIME_TYPE_JSON) {
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

export const setApiUrl = (newApiRoot: string) => {
  apiRoot = newApiRoot;
  if (newApiRoot === 'mock') {
    useMocks = true;
  } else {
    useMocks = false;
  }
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
