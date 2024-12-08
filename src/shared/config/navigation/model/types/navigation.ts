import {NavigationTabLists} from './tab-navigation.ts';

export enum AppNavigation {
  WELCOME = 'Welcome',
  WELCOME_INFO = 'WelcomeInfo',
  MAIN = 'Main',
  AUTH = 'Auth',
  REGISTRATION = 'Registration',
  VERIFY = 'Verify',
  FORGOT = 'Forgot',
  COURSE = 'Course',
}

interface NavigationSplashType {
  show?: boolean;
}

export type NavigationStackLists = {
  [AppNavigation.WELCOME]: undefined;
  [AppNavigation.WELCOME_INFO]: undefined;
  [AppNavigation.MAIN]: undefined;
  [AppNavigation.AUTH]: NavigationSplashType | undefined;
  [AppNavigation.REGISTRATION]: NavigationSplashType | undefined;
  [AppNavigation.VERIFY]: undefined;
  [AppNavigation.FORGOT]: NavigationSplashType | undefined;
  [AppNavigation.COURSE]: {courseId: number};
};

export type RootStackParamList = NavigationStackLists & NavigationTabLists;
