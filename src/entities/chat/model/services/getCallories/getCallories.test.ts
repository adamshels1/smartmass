import {getCalories} from './getCallories.ts';

describe('getCalories', () => {
  jest.setTimeout(30000); // Увеличение таймаута до 30000 мс (30 секунд) для всех тестов в этом файле

  it('should return a valid calorie number from the API', async () => {
    const params = {
      weight: 60,
      height: 167,
      weightChangeGoal: 10,
      goal: 'gain weight',
      allergies: [],
      likedDishes: [],
      maxMealPerDay: 4,
      dailyMealStartTime: '08:00',
      dailyMealEndTime: '20:00',
      preferredProducts: '',
      age: 32,
      gender: 'male',
    };

    const result = await getCalories(params);

    // Проверяем, что результат — это число и больше 0.
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });
});
