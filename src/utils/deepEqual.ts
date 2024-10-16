export const deepEqual = (x: any, y: any): boolean => {
  if (x === y) {
    return true;
  }

  if (
    typeof x !== 'object' ||
    x === null ||
    typeof y !== 'object' ||
    y === null
  ) {
    return false;
  }

  // Проверка, являются ли оба объекта массивами
  const isArrayX = Array.isArray(x);
  const isArrayY = Array.isArray(y);
  if (isArrayX !== isArrayY) {
    return false;
  }
  if (isArrayX && isArrayY) {
    if (x.length !== y.length) {
      return false;
    }
    for (let i = 0; i < x.length; i++) {
      if (!deepEqual(x[i], y[i])) {
        return false;
      }
    }
    return true;
  }

  const keysX = Object.keys(x);
  const keysY = Object.keys(y);

  if (keysX.length !== keysY.length) {
    return false;
  }

  for (const prop of keysX) {
    if (!Object.prototype.hasOwnProperty.call(y, prop)) {
      return false;
    }
    if (!deepEqual(x[prop], y[prop])) {
      return false;
    }
  }

  return true;
};
