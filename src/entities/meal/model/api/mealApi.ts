import apiInstance from 'shared/api/apiInstance.ts';
import {MealResponse, Meal} from 'entities/meal/model/types/mealTypes.ts';
import moment from 'moment';

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

export const updateMeal = async (meal: Meal): Promise<void> => {
  try {
    const response = await apiInstance.put('/meal/updateMeal', meal);
    console.log('Meal updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

export const addUnplannedMeal = async (
  date: string,
  description: string,
  time: string,
  dishCalories: number,
): Promise<void> => {
  try {
    const response = await apiInstance.post('/meal/addUnplannedMeal', {
      date,
      description,
      time,
      dishCalories,
    });
    console.log('Unplanned meal added:', response.data);
  } catch (error) {
    console.error('Error adding unplanned meal:', error);
    throw error;
  }
};

export const getDaysWithMeals = async (
  startDate: string = moment().startOf('month').format('YYYY-MM-DD'),
  endDate: string = moment().endOf('month').format('YYYY-MM-DD'),
): Promise<any> => {
  try {
    const response = await apiInstance.get<any>('/meal/getDaysWithMeals', {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting days with meals:', error);
    throw error;
  }
};
