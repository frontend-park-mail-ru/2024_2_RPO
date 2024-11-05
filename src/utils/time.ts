export const formatTime = (time: Date): string => {
  const now = Date.now();
  const differenceInMilliseconds = now - time.getTime();

  const millisecondsInMinute = 60 * 1000;
  const millisecondsInHour = 60 * millisecondsInMinute;
  const millisecondsInDay = 24 * millisecondsInHour;
  let result;
  if (differenceInMilliseconds < millisecondsInMinute) {
    result = 'менее минуты назад';
  } else if (differenceInMilliseconds < millisecondsInHour) {
    const minutes = Math.floor(differenceInMilliseconds / millisecondsInMinute);
    result = `${minutes} минут назад`;
  } else if (differenceInMilliseconds < millisecondsInDay) {
    const hours = Math.floor(differenceInMilliseconds / millisecondsInHour);
    result = `${hours} часов назад`;
  } else {
    const days = Math.floor(differenceInMilliseconds / millisecondsInDay);
    result = `${days} дней назад`;
  }
  return result;
};
