export interface Meal {
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

export interface DayMeals {
  date: string;
  meals: Meal[];
}

export interface MealsState {
  days: DayMeals[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

//TODO
export interface MealResponse {}
