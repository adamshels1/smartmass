export enum AppTabNavigation {
  HOME = 'Home',
  CALENDAR = 'Plan',
  CART = 'Cart',
  SETTINGS = 'Settings',
}

export type NavigationTabLists = {
  [AppTabNavigation.HOME]: undefined;
  [AppTabNavigation.CALENDAR]: undefined;
  [AppTabNavigation.CART]: undefined;
  [AppTabNavigation.SETTINGS]: undefined;
};
