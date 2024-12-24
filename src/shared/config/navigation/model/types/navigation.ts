import {NavigationTabLists} from './tab-navigation.ts';

export enum AppNavigation {
  HOME = 'Home',
  WELCOME = 'Welcome',
  WELCOME_INFO = 'WelcomeInfo',
  MAIN = 'Main',
  AUTH = 'Auth',
  REGISTRATION = 'Registration',
  VERIFY = 'Verify',
  SUCCESS_VERIFY = 'Success Verify',
  FORGOT = 'Forgot',
  COURSE = 'Course',
  MEAL_CALENDAR = 'MealCalendar',

  SETTINGS_STEPS = 'STEPS',

  SETTINGS_MENU = 'Settings',
  GOAL = 'Goal',
  PERSONAL_DATA = 'Personal data',
  MEAL_DATA = 'Meal data',
  FOOD_PREFERENCES = 'Food preferences',
  DAILY_CALORIES = 'Daily calories',
  ACCOUNT_SETTINGS = 'Account settings',

  MEAL_DETAILS = 'Meal Details',

  DAILY_MEALS = 'Daily Meals',
}

interface NavigationSplashType {
  show?: boolean;
}

export type NavigationStackLists = {
  [AppNavigation.HOME]: undefined;
  [AppNavigation.WELCOME]: undefined;
  [AppNavigation.WELCOME_INFO]: undefined;
  [AppNavigation.MAIN]: undefined;
  [AppNavigation.AUTH]: NavigationSplashType | undefined;
  [AppNavigation.REGISTRATION]: NavigationSplashType | undefined;
  [AppNavigation.VERIFY]: {email: string; password: string};
  [AppNavigation.SUCCESS_VERIFY]: undefined;
  [AppNavigation.FORGOT]: NavigationSplashType | undefined;
  [AppNavigation.COURSE]: {courseId: number};
  [AppNavigation.MEAL_CALENDAR]: undefined;

  [AppNavigation.SETTINGS_STEPS]: undefined;
  [AppNavigation.SETTINGS_MENU]: undefined;
  [AppNavigation.GOAL]: undefined;
  [AppNavigation.PERSONAL_DATA]: undefined;
  [AppNavigation.MEAL_DATA]: undefined;
  [AppNavigation.FOOD_PREFERENCES]: undefined;
  [AppNavigation.DAILY_CALORIES]: undefined;

  [AppNavigation.MEAL_DETAILS]: {mealId: number};
  [AppNavigation.DAILY_MEALS]: {date?: string};
};

export type RootStackParamList = NavigationStackLists & NavigationTabLists;
