import {Meal} from 'features/chat/model/types/diet.ts';

export interface MessageItem {
  role: 'user' | 'other';
  parts?: {text: string}[];
  data?: {
    type?: 'diet' | 'recipe';
    diet?: Meal[];
    meal?: Meal;
  };
}

export interface SendMessageType {
  messageText: string;
  messageTextVisible: boolean;
  nextStep: string | null;
  changedDiet?: Meal[];
  meal?: Meal;
  chatMessagesRef: any;
}

// Определение интерфейсов
export interface Product {
  name: string;
  nameEn: string;
  amount: number;
  units: string;
}

export interface Meal {
  time: string;
  name: string;
  dish: string;
  dishEn: string;
  dishCalories: number;
  recipe: string;
}

export interface DailyDiet {
  diet: Meal[];
  dietTotalCalories: string;
  products: Product[];
}
