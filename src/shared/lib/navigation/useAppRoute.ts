// shared/lib/hooks/useAppRoute.ts
import {useRoute, RouteProp} from '@react-navigation/native';
import {AppNavigation, NavigationStackLists} from 'shared/config/navigation';

type AppRouteProp = RouteProp<NavigationStackLists, AppNavigation.MEAL_DETAILS>;

export const useAppRoute = () => {
  const route = useRoute<AppRouteProp>();
  return route;
};
