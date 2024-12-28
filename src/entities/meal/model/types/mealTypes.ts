export interface Meal {
  id: number;
  userId: number;
  date: string;
  isMealTaken: boolean;
  isPlanned: boolean;
  time: string;
  name: string;
  dish: string;
  dishEn: string;
  dishCalories: number;
  recipe: string;
  requestDescription: string;
  requestIngredients: string[];
  createdAt: Date;
  updatedAt: Date;
  mealDetail?: MealDetails;
}

// Ingredient type
export interface Ingredient {
  name: string;
  nameEn: string;
  amount: string;
  units: string;
  checked?: boolean;
}

// Recipe type
export interface MealDetails {
  ingredients: Ingredient[];
  id: number;
  mealId: number;
  date: string;
  fullRecipe: string;
  proteins: number;
  fats: number;
  carbohydrates: number;
  cookingTime: string;
  updatedAt: string;
  createdAt: string;
}

export interface MealDetailsResponse {
  data: Meal;
}

export interface MealResponse {
  date: string;
  meals: Meal[];
}

export interface DayMeals {
  date: string;
  meals: Meal[];
  totalCalories: number;
  takenCalories: number;
}

export interface MealsState {
  days: DayMeals[];
  mealsDetails: Meal[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

//TODO
export interface MealResponse {}
