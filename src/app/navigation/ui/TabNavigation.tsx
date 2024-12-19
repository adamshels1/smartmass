import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppTabNavigation, NavigationTabLists} from 'shared/config/navigation';
import DailyMealsScreen from 'screens/DailyMealsScreen.tsx';
import CalorieCalendarScreen from 'screens/CalorieCalendarScreen.tsx';
import Cart from 'screens/CartScreen.tsx';
import {
  CalendarIcon,
  HomeIcon,
  SettingsIcon,
  ShoppingCar,
} from 'shared/assets/icons';
import SettingsScreen from 'screens/Settings/SettingsScreen.tsx';

const Tab = createBottomTabNavigator<NavigationTabLists>();

const TabNavigation: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={AppTabNavigation.HOME}
        component={DailyMealsScreen}
        options={{
          tabBarIcon: ({color, size}) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={AppTabNavigation.CALENDAR}
        component={CalorieCalendarScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <CalendarIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={AppTabNavigation.CART}
        component={Cart}
        options={{
          tabBarIcon: ({color, size}) => (
            <ShoppingCar width={size} height={size} />
          ),
        }}
      />
      <Tab.Screen
        name={AppTabNavigation.SETTINGS}
        component={SettingsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <SettingsIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
