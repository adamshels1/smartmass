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

  SETTINGS = 'Settings',
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
};

export type RootStackParamList = NavigationStackLists & NavigationTabLists;
