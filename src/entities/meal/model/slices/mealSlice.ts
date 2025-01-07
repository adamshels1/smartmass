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
  loadingPercentage: 0, // Добавлено новое свойство
  generateMealsStatus: 'idle', // Новый статус
  generateMealsError: null, // Новая ошибка
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
  void,
  {date: string; description: string},
  {state: RootState}
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

export const fetchUnloadedMealsDetails = createAsyncThunk(
  'meals/fetchUnloadedMealsDetails',
  async (_, {getState, dispatch}) => {
    const state = getState() as RootState;
    const now = new Date();
    const futureMeals: Meal[] = [];

    const totalMeals = state.meal.days.reduce(
      (acc, day) => acc + day.meals.length,
      0,
    );
    let loadedMeals = 0;

    state.meal.days.forEach(day => {
      day.meals.forEach(meal => {
        const mealTime = new Date(`${day.date}T${meal.time}`);
        if (
          mealTime > now &&
          !state.meal.mealsDetails.some(detail => detail.id === meal.id)
        ) {
          futureMeals.push(meal);
        }
      });
    });

    for (const meal of futureMeals) {
      loadedMeals += 1;
      const loadingPercentage = Math.round(
        (loadedMeals / futureMeals.length) * 100,
      );
      dispatch(setLoadingPercentage(loadingPercentage));
      await dispatch(fetchMealDetails({mealId: meal.id})).unwrap();
    }
  },
);

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    resetMealState: () => initialState,
    updateMealDetailsLocally: (state, action: PayloadAction<Meal[]>) => {
      state.mealsDetails = action.payload;
    },
    setLoadingPercentage: (state, action: PayloadAction<number>) => {
      state.loadingPercentage = action.payload;
    },
  },
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
        state.generateMealsStatus = 'loading';
      })
      .addCase(initiateGenerateDailyMeals.fulfilled, state => {
        state.generateMealsStatus = 'succeeded';
      })
      .addCase(initiateGenerateDailyMeals.rejected, (state, action) => {
        state.generateMealsStatus = 'failed';
        state.generateMealsError =
          action.error.message ?? 'Failed to generate meals';
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
      })
      .addCase(fetchUnloadedMealsDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUnloadedMealsDetails.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(fetchUnloadedMealsDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch future meals';
      });
  },
});

export const {resetMealState, updateMealDetailsLocally, setLoadingPercentage} =
  mealsSlice.actions;
export default mealsSlice.reducer;
