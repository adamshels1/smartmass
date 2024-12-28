import apiInstance from 'shared/api/apiInstance.ts';
import {
  MealResponse,
  Meal,
  MealDetailsResponse,
} from 'entities/meal/model/types/mealTypes.ts';
import moment from 'moment';

// Функция для генерации рациона
export const generateDailyMeals = async (
  date: string,
  mealCount: number,
  totalCalories: number,
  description: string,
): Promise<MealResponse> => {
  try {
    const response = await apiInstance.post<MealResponse>(
      '/meal/generateDailyMeals',
      {
        date,
        mealCount,
        totalCalories,
        description,
      },
    );
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.error('Error generating daily meals:', error);
    throw error;
  }
};

// Функция для получения рациона
export const getDailyMeals = async (date: string): Promise<MealResponse> => {
  try {
    const response = await apiInstance.get<MealResponse>(
      '/meal/getDailyMeals',
      {
        params: {
          date,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error getting daily meals:', error);
    throw error;
  }
};

export const updateMeal = async (id: number): Promise<void> => {
  try {
    const response = await apiInstance.put('/meal/updateMeal', {
      id,
    });
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

export const updateIsMealTaken = async (
  id: number,
  isMealTaken: boolean,
): Promise<any> => {
  try {
    const response = await apiInstance.put<any>('/meal/updateIsMealTaken', {
      id,
      isMealTaken,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating meal status:', error);
    throw error;
  }
};

export const getMealDetails = async (mealId: number): Promise<any> => {
  try {
    const response = await apiInstance.get<MealDetailsResponse>(
      '/meal/getMealDetails',
      {
        params: {
          mealId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error getting days with meals:', error);
    throw error;
  }
};

export const updateMealRequests = async (
  mealId: number,
  requestDescription: string,
  requestIngredients: string[],
): Promise<any> => {
  try {
    const response = await apiInstance.put<any>('/meal/updateMealRequests', {
      mealId,
      requestDescription,
      requestIngredients,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating meal status:', error);
    throw error;
  }
};

export const updateIngredientChecked = async (
  mealId: number,
  ingredientName: string,
  checked: boolean,
): Promise<{message: string; data: any}> => {
  try {
    const response = await apiInstance.put<{message: string; data: any}>(
      '/meal/updateIngredient',
      {
        mealId,
        ingredientName,
        checked,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating ingredient checked status:', error);
    throw error;
  }
};
