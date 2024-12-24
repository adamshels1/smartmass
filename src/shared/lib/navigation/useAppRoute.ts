import {useRoute, RouteProp} from '@react-navigation/native';
import {NavigationStackLists} from 'shared/config/navigation';

type AppRouteProp<T extends keyof NavigationStackLists> = RouteProp<
  NavigationStackLists,
  T
>;

export const useAppRoute = <T extends keyof NavigationStackLists>() => {
  const route = useRoute<AppRouteProp<T>>();
  return route;
};
