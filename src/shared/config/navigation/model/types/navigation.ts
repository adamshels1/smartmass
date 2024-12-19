import {NavigationTabLists} from './tab-navigation.ts';

export enum AppNavigation {
  HOME = 'Home',
  WELCOME = 'Welcome',
  WELCOME_INFO = 'WelcomeInfo',
  MAIN = 'Main',
  AUTH = 'Auth',
  REGISTRATION = 'Registration',
  VERIFY = 'Verify',
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
  [AppNavigation.VERIFY]: undefined;
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
};

export type RootStackParamList = NavigationStackLists & NavigationTabLists;
