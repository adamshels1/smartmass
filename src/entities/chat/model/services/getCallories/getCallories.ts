import {sendMessage_v2} from 'entities/chat/model/services/sendMessage_v2.ts';

interface GetCaloriesParams {
  weight: number | null;
  height: number | null;
  weightChangeGoal: string | null;
  goal: string | null;
  allergies: string[];
  likedDishes: string[];
  diet: string | null;
  calories: number | null;
  maxMealPerDay: number | null;
  dailyMealStartTime: string | null;
  dailyMealEndTime: string | null;
  preferredProducts: string | null;
  age: number | null;
  gender: string | null;
}

export const getCalories = async (params: GetCaloriesParams) => {
  const request = {
    messageText: `Calculate daily caloric intake using the Harris-Benedict equation. Round the result: ${JSON.stringify(
      params,
    )}`,
    responseFormat: 'number', // Assuming the response format is a number for calories
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Попытка ${attempt}`);
      const result = await sendMessage_v2(request);

      const calories = parseInt(result, 10);
      if (isNaN(calories)) {
        throw new Error('Ответ не является числом');
      }

      console.log('Калории успешно получены:', calories);
      return calories;
    } catch (error) {
      console.error(`Ошибка при получении калорий, попытка ${attempt}:`, error);
      if (attempt === 3) {
        throw error;
      }
    }
  }
};
