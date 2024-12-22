import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {MealsState, DayMeals, Meal, MealDetails} from '../types/mealTypes';
import {
  generateDailyMeals,
  getDailyMeals,
  updateMeal,
  getDaysWithMeals,
  getMealDetails,
} from '../api/mealApi.ts';

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

export const initiateGenerateDailyMeals = createAsyncThunk(
  'meals/generateDailyMeals',
  async (
    params: {
      date: string;
      mealCount: number;
      totalCalories: number;
      userId: number;
    },
    {dispatch},
  ) => {
    await generateDailyMeals(
      params.date,
      params.mealCount,
      params.totalCalories,
      params.userId,
    );
    dispatch(fetchDailyMeals({date: params.date, userId: params.userId}));
  },
);

export const initiateUpdateMeal = createAsyncThunk(
  'meals/updateMeal',
  async (meal: Meal) => {
    await updateMeal(meal);
  },
);

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDailyMeals.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchDailyMeals.fulfilled,
        (state, action: PayloadAction<{data: Meal[]; message: string}>) => {
          const dayMeals: DayMeals = {
            date: action.meta.arg.date,
            meals: action.payload.data.meals,
            totalCalories: action.payload.data.totalCalories,
            takenCalories: action.payload.data.takenCalories,
          };
          state.status = 'succeeded';
          state.days = state.days.filter(
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
        (
          state,
          action: PayloadAction<{data: MealDetails; message: string}>,
        ) => {
          state.status = 'succeeded';
          const existingIndex = state.mealsDetails.findIndex(
            meal => meal.mealId === action.payload.data.mealId,
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

export default mealsSlice.reducer;
