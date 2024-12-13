import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {MealsState, DayMeals, Meal} from '../types/mealTypes';
import {generateDailyMeals, getDailyMeals} from '../api/mealApi.ts';

const initialState: MealsState = {
  days: [],
  status: 'idle',
  error: null,
};

export const fetchDailyMeals = createAsyncThunk(
  'meals/fetchDailyMeals',
  async (params: {date: string; userId: number}) => {
    const response = await getDailyMeals(params.date, params.userId);
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
          console.log('action', action.meta.arg.date);
          const dayMeals: DayMeals = {
            date: action.meta.arg.date,
            meals: action.payload.data,
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
      });
  },
});

export default mealsSlice.reducer;
