import React, {memo} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppNavigation, NavigationStackLists} from 'shared/config/navigation';
import WelcomeScreen from 'screens/WelcomeScreen.js';
import LoginScreen from 'screens/LoginScreen.tsx';
import RegisterScreen from 'screens/RegisterScreen.tsx';
import EmailVerificationForm from 'entities/auth/ui/EmailVerificationForm.tsx';
import HealthTrackingForm from 'features/healthTracking/ui/HealthTrackingForm.tsx';
import MealCalendarScreen from 'features/meal/ui/MealCalendarScreen.tsx';
import TabNavigation from './TabNavigation.tsx';
import DailyMealsScreen from 'screens/DailyMealsScreen.tsx';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider';

// Create separate stacks for authenticated and unauthenticated routes
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name={AppNavigation.AUTH}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
      component={LoginScreen}
    />
    <AuthStack.Screen
      name={AppNavigation.WELCOME}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
      component={WelcomeScreen}
    />
    <AuthStack.Screen
      name={AppNavigation.REGISTRATION}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
      component={RegisterScreen}
    />
    <AuthStack.Screen
      name={AppNavigation.VERIFY}
      options={{
        headerTransparent: true,
      }}
      component={EmailVerificationForm}
    />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator>
    <AppStack.Screen
      name={AppNavigation.SETTINGS}
      options={{
        headerTransparent: true,
      }}
      component={HealthTrackingForm}
    />
    <AppStack.Screen
      name={AppNavigation.HOME}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
      component={TabNavigation}
    />
    <AppStack.Screen
      name={AppNavigation.MEAL_CALENDAR}
      options={{
        headerTransparent: true,
      }}
      component={MealCalendarScreen}
    />
  </AppStack.Navigator>
);

const Navigation = () => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  console.log('isAuth', isAuth);

  return (
    <NavigationContainer theme={DefaultTheme}>
      {isAuth ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default memo(Navigation);
