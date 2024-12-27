import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {MealsState, DayMeals, Meal} from '../types/mealTypes';
import {
  generateDailyMeals,
  getDailyMeals,
  updateMeal,
  getDaysWithMeals,
  getMealDetails,
} from '../api/mealApi.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {RootState} from 'app/providers/StoreProvider';

const initialState: MealsState = {
  days: [],
  mealsDetails: [],
  status: 'idle',
  error: null,
};

export const fetchMealDetails = createAsyncThunk(
  'meals/fetchMealDetails',
  async (params: {mealId: number}) => {
    const response = await getMealDetails(params.mealId);
    return response;
  },
);

export const fetchDailyMeals = createAsyncThunk(
  'meals/fetchDailyMeals',
  async (params: {date: string}) => {
    const response = await getDailyMeals(params.date);
    return response;
  },
);

export const fetchDaysWithMeals = createAsyncThunk(
  'meals/fetchDaysWithMeals',
  async (params: {startDate: string; endDate: string}) => {
    const response = await getDaysWithMeals(params.startDate, params.endDate);
    console.log('response', response);
    return response;
  },
);

export const initiateGenerateDailyMeals = createAsyncThunk<
  void, // Тип возвращаемого значения
  {date: string; description: string}, // Тип параметров
  {state: RootState} // Тип thunkAPI
>(
  'meals/generateDailyMeals',
  async ({date, description}, {dispatch, getState}) => {
    try {
      const {maxMealPerDay, dailyCalories} = getState().userDetails.userDetails;
      if (maxMealPerDay && dailyCalories) {
        await generateDailyMeals(
          date,
          maxMealPerDay,
          dailyCalories,
          description,
        );
        dispatch(fetchDailyMeals({date}));
      }
    } catch (error: any) {
      console.error('Failed to generate daily meals:', error);

      // Показать сообщение об ошибке от сервера
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: error.response?.data?.message || 'Ошибка',
        textBody:
          error.response?.data?.error ||
          'Произошла ошибка при генерации рациона.',
      });
    }
  },
);

export const initiateUpdateMeal = createAsyncThunk(
  'meals/updateMeal',
  async (id: number) => {
    await updateMeal(id);
  },
);

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {resetMealState: () => initialState},
  extraReducers: builder => {
    // @ts-ignore
    builder
      .addCase(fetchDailyMeals.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchDailyMeals.fulfilled,
        (state, action: PayloadAction<{data: DayMeals; message: string}>) => {
          const dayMeals: DayMeals = {
            // @ts-ignore
            date: action.meta.arg.date,
            meals: action.payload.data.meals,
            totalCalories: action.payload.data.totalCalories,
            takenCalories: action.payload.data.takenCalories,
          };
          state.status = 'succeeded';
          state.days = state.days.filter(
            // @ts-ignore
            day => day.date !== action.meta.arg.date,
          );
          state.days.push(dayMeals);
        },
      )
      .addCase(fetchDailyMeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch meals';
      })
      .addCase(initiateGenerateDailyMeals.pending, state => {
        state.status = 'loading';
      })
      .addCase(initiateGenerateDailyMeals.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(initiateGenerateDailyMeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to generate meals';
      })
      .addCase(initiateUpdateMeal.pending, state => {
        state.status = 'loading';
      })
      .addCase(initiateUpdateMeal.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(initiateUpdateMeal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to update meal';
      })
      .addCase(fetchDaysWithMeals.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchDaysWithMeals.fulfilled,
        (state, action: PayloadAction<{data: DayMeals[]; message: string}>) => {
          state.status = 'succeeded';
          state.days = action.payload.data;
        },
      )
      .addCase(fetchDaysWithMeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch days with meals';
      })
      .addCase(fetchMealDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchMealDetails.fulfilled,
        (state, action: PayloadAction<{data: Meal; message: string}>) => {
          state.status = 'succeeded';
          const existingIndex = state.mealsDetails.findIndex(
            meal => meal.id === action.payload.data.id,
          );

          if (existingIndex !== -1) {
            state.mealsDetails[existingIndex] = action.payload.data;
          } else {
            state.mealsDetails.push(action.payload.data);
          }
        },
      )
      .addCase(fetchMealDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch meal details';
      });
  },
});

export const {resetMealState} = mealsSlice.actions;
export default mealsSlice.reducer;
