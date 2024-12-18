// src/entities/userDetails/model/types/goalTypes.ts
export enum Goal {
  MaintainWeight = 'maintain weight',
  GainWeight = 'gain weight',
  LoseWeight = 'lose weight',
}

// src/entities/userDetails/model/types/goalTypes.ts
export enum Gender {
  Male = 'male',
  Female = 'female',
}

// src/entities/userDetails/model/types/userDetailsTypes.ts

export interface UserDetails {
  id?: number;
  userId?: number;
  weight: number | null;
  height: number | null;
  targetWeight: number | null;
  goal: Goal | null;
  preferredFoods: string[];
  avoidFoods: string[];
  allergens: string[];
  maxMealPerDay: number | null;
  dailyMealStartTime: string | null;
  dailyMealEndTime: string | null;
  age: number | null;
  gender: Gender | null;
  dailyCalories: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetailsState {
  userDetails: UserDetails;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
