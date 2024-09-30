let apiRoot: string = '';

/**
 * Функция получает полный URL ресурса в API
 * @param addr адрес ресурса в API. Например, /users/me
 * @returns
 */
export const getApiUrl = (addr: string): string => {
  if (addr.startsWith('/')) {
    return apiRoot + addr;
  }
  return apiRoot + '/' + addr;
};
export const setApiUrl = (apiRoot_: string) => {
  apiRoot = apiRoot_;
};

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_INTERNAL_ERROR = 500;
