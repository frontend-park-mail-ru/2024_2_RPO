/**
 * Перевести многомерный массив в 1D
 * @param arr Массив, который надо перевести в 1D
 * @returns Массив в 1D
 */
export const flatten = (arr: any[]): any[] => {
  const flattenedArray = arr.slice(0); // Копирование
  for (let i = 0; i < flattenedArray.length; i++) {
    const currentItem = flattenedArray[i];
    if (Array.isArray(currentItem)) {
      const flattened = flatten(currentItem);
      flattenedArray.splice(i, 1, ...flattened);
    }
  }
  return flattenedArray;
};
