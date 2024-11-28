import {sendMessage_v2} from 'entities/chat/model/services/sendMessage_v2.ts';
import {fullDietPrompt} from 'entities/chat/model/types/promt.ts';
import {jsonParse} from 'utils/format.js';

// Пример рациона питания
const dietExample = `[
      {
        "diet": [
          {
            "time": "8:00",
            "name": "Завтрак",
            "dish": "Овсяная каша с орехами и сухофруктами",
            "dishEn": "oatmeal with nuts and dried fruit",
            "dishCalories": "450 ккал",
            "recipe": "Сварить овсяную кашу на воде или молоке. Добавить орехи и сухофрукты по вкусу."
          },
          {
            "time": "13:00",
            "name": "Обед",
            "dish": "Куриная грудка с бурым рисом и овощами",
            "dishEn": "chicken breast with brown rice and vegetables",
            "dishCalories": "800 ккал",
            "recipe": "Отварить куриную грудку. Отварить бурый рис. Приготовить овощи (например, брокколи, морковь, лук) на пару или на гриле."
          },
          {
            "time": "18:00",
            "name": "Ужин",
            "dish": "Лосось с киноа и овощами",
            "dishEn": "salmon with quinoa and vegetables",
            "dishCalories": "950 ккал",
            "recipe": "Запечь лосось в духовке. Отварить киноа. Приготовить овощи на пару или на гриле."
          },
          {
            "time": "21:00",
            "name": "Перекус",
            "dish": "Протеиновый коктейль с бананом",
            "dishEn": "protein shake with banana",
            "dishCalories": "300 ккал",
            "recipe": "Смешать в блендере протеиновый порошок, банан и молоко."
          },
          {
            "time": "23:00",
            "name": "Перекус перед сном",
            "dish": "Творог с медом",
            "dishEn": "cottage cheese with honey",
            "dishCalories": "500 ккал",
            "recipe": "Смешать творог с медом по вкусу."
          }
        ],
        "dietTotalCalories": "3000 ккал"
      }
    ]`;

// Функция для отправки сообщения и получения диеты
export const getFullDailyDiet = async () => {
  const request =
    'Добавь fullRecipe, proteins, carbohydrates, cookingTime, products  ';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Попытка ${attempt}`);
      const result = await sendMessage_v2({
        messageText:
          request +
          `{
            "time": "13:00",
            "name": "Обед",
            "dish": "Куриная грудка с бурым рисом и овощами",
            "dishEn": "chicken breast with brown rice and vegetables",
            "dishCalories": "800 ккал",
            "recipe": "Отварить куриную грудку. Отварить бурый рис. Приготовить овощи (например, брокколи, морковь, лук) на пару или на гриле."
          }`,
        responseFormat: fullDietPrompt,
      });

      const jsonResponse: any = jsonParse(result);
      validateFullDietResponse(jsonResponse);
      console.log('Диета успешно получена:', jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error(`Ошибка при получении диеты, попытка ${attempt}:`, error);
      if (attempt === 3) {
        throw error;
      }
    }
  }
};

// Функция для валидации структуры JSON-ответа
function validateFullDietResponse(response: any) {
  if (!response) {
    throw new Error('Неверный формат ответа');
  }

  if (
    !response.time ||
    !response.name ||
    !response.dish ||
    !response.dishEn ||
    !response.dishCalories ||
    !response.fullRecipe
  ) {
    throw new Error('Неверный формат элемента блюда');
  }

  if (parseInt(response.dishCalories) !== 800) {
    throw new Error('Общая сумма калорий не равна 500');
  }
}
