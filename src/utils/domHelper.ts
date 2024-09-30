/**
 * Хелпер для получения элемента input по id
 * @throws TypeError, если элемент не найден
 */
export const getInputElementById = (id: string): HTMLInputElement => {
  const ret = document.getElementById(id);
  if (ret instanceof HTMLInputElement) {
    return ret;
  }
  throw new TypeError();
};
