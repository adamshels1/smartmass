import apiInstance from 'shared/api/apiInstance.ts';

interface Meal {
  id: number;
  userId: number;
  date: Date;
  isMealTaken: boolean;
  isPlanned: boolean;
  time: string;
  name: string;
  dish: string;
  dishEn: string;
  dishCalories: number;
  recipe: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MealResponse {
  date: string;
  meals: Meal[];
}

// Функция для генерации рациона
export const generateDailyMeals = async (
  date: string,
  mealCount: number,
  totalCalories: number,
  userId: number,
): Promise<MealResponse> => {
  try {
    const response = await apiInstance.post<MealResponse>(
      '/meal/generateDailyMeals',
      {
        date,
        mealCount,
        totalCalories,
        userId,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error generating daily meals:', error);
    throw error;
  }
};

// Функция для получения рациона
export const getDailyMeals = async (
  date: string,
  userId: number,
): Promise<MealResponse> => {
  try {
    const response = await apiInstance.get<MealResponse>(
      '/meal/getDailyMeals',
      {
        params: {
          date,
          userId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error getting daily meals:', error);
    throw error;
  }
};
