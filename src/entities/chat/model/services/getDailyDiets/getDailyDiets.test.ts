import {getDailyDiets} from 'entities/chat/model/services/getDailyDiets/getDailyDiets.ts';

describe('getDailyDiets', () => {
  jest.setTimeout(30000); // Увеличение таймаута до 20000 мс (20 секунд) для всех тестов в этом файле

  it('should return a valid response from the API', async () => {
    const result = await getDailyDiets();

    // Проверяем, что результат не пустой и имеет ожидаемую структуру.
    expect(result).toBeDefined();
    expect(result).toMatch(/.+/); // Проверяем, что результат — непустая строка.

    // Пример проверки структуры JSON-ответа
    const jsonResponse: any[] = JSON.parse(result);
    expect(Array.isArray(jsonResponse)).toBeTruthy();
    jsonResponse.forEach(item => {
      expect(item).toHaveProperty('diet');
      expect(item).toHaveProperty('dietTotalCalories');
      // expect(item).toHaveProperty('products');

      item.diet.forEach((meal: any) => {
        expect(meal).toHaveProperty('time');
        expect(meal).toHaveProperty('name');
        expect(meal).toHaveProperty('dish');
        expect(meal).toHaveProperty('dishEn');
        expect(meal).toHaveProperty('dishCalories');
      });

      // item.products.forEach((product: any) => {
      //   expect(product).toHaveProperty('name');
      //   expect(product).toHaveProperty('nameEn');
      //   expect(product).toHaveProperty('amount');
      //   expect(product).toHaveProperty('units');
      // });
    });

    // Проверка, что общая сумма калорий равна 3000
    const totalCalories = jsonResponse.reduce(
      (acc, item) => acc + parseInt(item.dietTotalCalories, 10),
      0,
    );
    expect(totalCalories).toBe(3000);
  });
});
