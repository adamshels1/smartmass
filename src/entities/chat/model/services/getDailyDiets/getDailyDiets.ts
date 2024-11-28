import {sendMessage_v2} from 'entities/chat/model/services/sendMessage_v2.ts';
import {dietsPrompt} from 'entities/chat/model/types/promt.ts';

// Function to send a message and get daily diets with retries
export const getDailyDiets = async () => {
  const request =
    'Дай рацион питания на целый день для 3 приемов пищи, общие калории должны быть равны 3000 ккал';

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Попытка ${attempt}`);
      const result = await sendMessage_v2({
        messageText: request,
        responseFormat: dietsPrompt,
      });

      const jsonResponse: any[] = JSON.parse(result);
      validateDietResponse(jsonResponse);
      console.log('Рацион успешно получен:', jsonResponse);
      return result;
    } catch (error) {
      console.error(`Ошибка при получении рациона, попытка ${attempt}:`, error);
      if (attempt === 3) {
        throw error;
      }
    }
  }
};

// Function to validate the structure of JSON response
function validateDietResponse(response: any[]) {
  if (!Array.isArray(response)) {
    throw new Error('Неверный формат ответа');
  }

  response.forEach(item => {
    if (!item.diet || !item.dietTotalCalories) {
      throw new Error('Неверный формат элемента рациона');
    }

    item.diet.forEach((meal: any) => {
      if (
        !meal.time ||
        !meal.name ||
        !meal.dish ||
        !meal.dishEn ||
        !meal.dishCalories
      ) {
        throw new Error('Неверный формат элемента блюда');
      }
    });
  });

  // Проверка, что общая сумма калорий равна 3000
  const totalCalories = response.reduce(
    (acc, item) => acc + parseInt(item.dietTotalCalories, 10),
    0,
  );
  if (totalCalories !== 3000) {
    throw new Error('Общая сумма калорий не равна 3000');
  }
}
