import {getFullDailyDiet} from 'entities/chat/model/services/getFullDailyDiet/getFullDailyDiet.ts';

describe('getFullDailyDiet', () => {
  jest.setTimeout(20000); // Увеличение таймаута до 20000 мс (20 секунд) для всех тестов в этом файле

  it('should return a valid response from the API', async () => {
    const result = await getFullDailyDiet();

    // Проверяем, что результат не пустой и имеет ожидаемую структуру.
    expect(result).toBeDefined();

    // Пример проверки структуры JSON-ответа

    expect(result).toHaveProperty('time');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('dish');
    expect(result).toHaveProperty('dishEn');
    expect(result).toHaveProperty('dishCalories');
    expect(result).toHaveProperty('fullRecipe');

    // Проверка, что общая сумма калорий равна 3000
    expect(parseInt(result.dishCalories)).toBe(800);
  });
});
