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

function padZero(num: number) {
  return num.toString().padStart(2, '0');
}

export function formatDateToGoTimeString(date: Date) {
  // Убедимся, что переданный объект является экземпляром Date
  if (!(date instanceof Date)) {
    throw new TypeError('Input должен быть экземпляром Date');
  }

  // Получаем компоненты даты в UTC
  const year = date.getUTCFullYear();
  const month = padZero(date.getUTCMonth() + 1); // Месяцы в JS начинаются с 0
  const day = padZero(date.getUTCDate());
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  // Формируем строку в формате RFC3339
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}
