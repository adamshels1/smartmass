export interface Meal {
  time: string;
  name: string;
  dish: string;
  dishCalories: string;
  dishEn: string;
}

export interface MessageItem {
  role: 'user' | 'other';
  parts?: {text: string}[];
  data?: {
    type?: 'diet' | 'recipe';
    diet?: Meal[];
    meal?: Meal;
  };
}
