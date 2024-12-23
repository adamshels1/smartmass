import React, {memo} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppNavigation} from 'shared/config/navigation';
import WelcomeScreen from 'screens/WelcomeScreen.tsx';
import LoginScreen from 'screens/LoginScreen.tsx';
import RegisterScreen from 'screens/RegisterScreen.tsx';
import EmailVerificationForm from 'entities/auth/ui/EmailVerificationForm.tsx';
import MealCalendarScreen from 'features/meal/ui/MealCalendarScreen.tsx';
import TabNavigation from './TabNavigation.tsx';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider';

import GoalScreen from 'screens/Settings/GoalScreen.tsx';
import PersonalDataScreen from 'screens/Settings/PersonalDataScreen.tsx';
import MealDataScreen from 'screens/Settings/MealDataScreen.tsx';
import DailyCaloriesScreen from 'screens/Settings/DailyCaloriesScreen.tsx';
import FoodPreferencesScreen from 'screens/Settings/FoodPreferencesScreen.tsx';
import SettingsStepsScreen from 'screens/Settings/SettingsStepsScreen.tsx';
import MealDetailsScreen from 'screens/MealDetailsScreen.tsx';
import DailyMealsScreen from 'screens/DailyMealsScreen.tsx';

// Create separate stacks for authenticated and unauthenticated routes
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const AuthNavigator = () => {
  const showWelcomeScreen = useSelector(
    (state: RootState) => state.auth.showWelcomeScreen,
  );
  return (
    <AuthStack.Navigator
      initialRouteName={
        showWelcomeScreen ? AppNavigation.WELCOME : AppNavigation.AUTH
      }>
      <AuthStack.Screen
        name={AppNavigation.WELCOME}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={WelcomeScreen}
      />
      <AuthStack.Screen
        name={AppNavigation.AUTH}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={LoginScreen}
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
};

const AppNavigator = () => (
  <AppStack.Navigator>
    <AppStack.Screen
      name={AppNavigation.HOME}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
      component={TabNavigation}
    />

    <AppStack.Screen
      name={AppNavigation.DAILY_MEALS}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
      component={DailyMealsScreen}
    />

    <AppStack.Screen
      name={AppNavigation.SETTINGS_STEPS}
      options={{
        headerTransparent: true,
      }}
      component={SettingsStepsScreen}
    />

    <AppStack.Screen
      name={AppNavigation.GOAL}
      options={{
        headerTransparent: true,
      }}
      component={GoalScreen}
    />
    <AppStack.Screen
      name={AppNavigation.PERSONAL_DATA}
      options={{
        headerTransparent: true,
      }}
      component={PersonalDataScreen}
    />
    <AppStack.Screen
      name={AppNavigation.MEAL_DATA}
      options={{
        headerTransparent: true,
      }}
      component={MealDataScreen}
    />
    <AppStack.Screen
      name={AppNavigation.FOOD_PREFERENCES}
      options={{
        headerTransparent: true,
      }}
      component={FoodPreferencesScreen}
    />
    <AppStack.Screen
      name={AppNavigation.DAILY_CALORIES}
      options={{
        headerTransparent: true,
      }}
      component={DailyCaloriesScreen}
    />
    <AppStack.Screen
      name={AppNavigation.MEAL_CALENDAR}
      options={{
        headerTransparent: true,
      }}
      component={MealCalendarScreen}
    />
    <AppStack.Screen
      name={AppNavigation.MEAL_DETAILS}
      options={{
        headerShown: false,
        headerTransparent: true,
      }}
      component={MealDetailsScreen}
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
