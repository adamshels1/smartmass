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
  selectedDate: string;
  messageText: string;
  messageTextVisible: boolean;
  nextStep: string | null;
  changedDiet?: Meal[];
  meal?: Meal;
  chatMessagesRef: any;
}
