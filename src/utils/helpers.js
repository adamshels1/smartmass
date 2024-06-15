const moment = require('moment');

export function getTimeStamp(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);

  // Create a new Date object with today's date and the specified time
  const today = new Date();
  const time = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hours,
    minutes,
  );

  // Return the timestamp
  return time.getTime();
}

export function getNextMeal(mealTimes, date) {
  if (!mealTimes?.length) {
    return null;
  }
  // Получаем текущее время
  const currentTime = moment();

  // Сортируем приемы пищи по времени в порядке возрастания
  const sortedMeals = mealTimes?.sort((a, b) => {
    const timeA = moment(a.time, 'HH:mm');
    const timeB = moment(b.time, 'HH:mm');
    return timeA - timeB;
  });

  // Находим следующий прием пищи после текущего времени
  for (let i = 0; i < sortedMeals.length; i++) {
    const mealTime = moment(
      moment(date).format('YYYY-MM-DD') + ' ' + sortedMeals[i].time,
      'YYYY-MM-DD HH:mm',
    );
    // const mealTime = moment(sortedMeals[i].time, 'HH:mm');
    if (mealTime.isAfter(currentTime)) {
      return sortedMeals[i];
    }
  }

  // Если текущее время позже всех приемов пищи, возвращаем первый прием пищи на следующий день
  return sortedMeals[0];
}

export function getCurrentMeal(mealTimes, date) {
  if (!mealTimes?.length) {
    return null;
  }

  // Получаем текущее время
  const currentTime = moment();

  // Сортируем приемы пищи по времени в порядке убывания
  const sortedMeals = mealTimes?.sort((a, b) => {
    const timeA = moment(a.time, 'HH:mm');
    const timeB = moment(b.time, 'HH:mm');
    return timeB - timeA;
  });

  // Находим предыдущий прием пищи перед текущим временем
  for (let i = 0; i < sortedMeals.length; i++) {
    const mealTime = moment(
      currentTime.format('YYYY-MM-DD') + ' ' + sortedMeals[i].time,
      'YYYY-MM-DD HH:mm',
    );
    if (mealTime.isBefore(currentTime)) {
      return sortedMeals[i];
    }
  }

  // Если текущее время раньше всех приемов пищи, возвращаем последний прием пищи с предыдущего дня
  return sortedMeals[sortedMeals.length - 1];
}
