// src/redux/slices/userDetailsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserDetailsState {
  selectedGoal: string;
  height: string;
  weight: string;
  age: string;
  gender: string;
  firstMeal: string;
  lastMeal: string;
  mealCount: string;
  preferredFoods: string[];
  avoidFoods: string[];
  allergens: string[];
}

const initialState: UserDetailsState = {
  selectedGoal: '',
  height: '',
  weight: '',
  age: '',
  gender: '',
  firstMeal: '',
  lastMeal: '',
  mealCount: '',
  preferredFoods: [],
  avoidFoods: [],
  allergens: [],
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    selectGoal: (state, action: PayloadAction<string>) => {
      state.selectedGoal = action.payload;
    },
    updatePersonalData: (
      state,
      action: PayloadAction<Partial<UserDetailsState>>,
    ) => {
      state.height = action.payload.height || state.height;
      state.weight = action.payload.weight || state.weight;
      state.age = action.payload.age || state.age;
      state.gender = action.payload.gender || state.gender;
    },
    updateMealData: (
      state,
      action: PayloadAction<Partial<UserDetailsState>>,
    ) => {
      state.firstMeal = action.payload.firstMeal || state.firstMeal;
      state.lastMeal = action.payload.lastMeal || state.lastMeal;
      state.mealCount = action.payload.mealCount || state.mealCount;
    },
    updateFoodPreferences: (
      state,
      action: PayloadAction<Partial<UserDetailsState>>,
    ) => {
      state.preferredFoods =
        action.payload.preferredFoods || state.preferredFoods;
      state.avoidFoods = action.payload.avoidFoods || state.avoidFoods;
      state.allergens = action.payload.allergens || state.allergens;
    },
  },
});

export const {
  selectGoal,
  updatePersonalData,
  updateMealData,
  updateFoodPreferences,
} = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
