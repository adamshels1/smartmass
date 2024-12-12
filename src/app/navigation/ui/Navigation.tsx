import React, {memo} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppNavigation, NavigationStackLists} from 'shared/config/navigation';
import WelcomeScreen from 'screens/WelcomeScreen.js';
import LoginScreen from 'features/Auth/ui/LoginScreen.tsx';
import RegisterScreen from 'features/Auth/ui/RegisterScreen.tsx';
import EmailVerificationForm from 'features/Auth/components/EmailVerificationForm.tsx';
import HealthTrackingForm from 'features/healthTracking/ui/HealthTrackingForm.tsx';
import MealCalendarScreen from 'features/meal/ui/MealCalendarScreen.tsx';
import TabNavigation from './TabNavigation.tsx';
import DailyMealsScreen from 'screens/DailyMealsScreen.tsx';

export const Stack = createNativeStackNavigator<NavigationStackLists>();

const Navigation = () => {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator initialRouteName={AppNavigation.HOME}>
        <Stack.Screen
          name={AppNavigation.HOME}
          options={{
            headerTransparent: true,
          }}
          component={TabNavigation}
        />
        <Stack.Screen
          name={AppNavigation.MEAL_CALENDAR}
          options={{
            headerTransparent: true,
          }}
          component={MealCalendarScreen}
        />
        <Stack.Screen
          name={AppNavigation.VERIFY}
          options={{
            headerTransparent: true,
          }}
          component={HealthTrackingForm}
        />
        <Stack.Screen
          name={AppNavigation.REGISTRATION}
          options={{
            headerTransparent: true,
          }}
          component={RegisterScreen}
        />
        <Stack.Screen
          name={AppNavigation.WELCOME}
          options={{
            headerTransparent: true,
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name={AppNavigation.AUTH}
          options={{
            headerTransparent: true,
          }}
          component={WelcomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(Navigation);
