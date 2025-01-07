import React, {memo} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppNavigation} from 'shared/config/navigation';
import WelcomeScreen from 'screens/WelcomeScreen.tsx';
import LoginScreen from 'screens/LoginScreen.tsx';
import RegisterScreen from 'screens/RegisterScreen.tsx';
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
import SubscriptionScreen from 'screens/Settings/SubscriptionScreen.tsx';
import MealDetailsScreen from 'screens/MealDetailsScreen.tsx';
import DailyMealsScreen from 'screens/DailyMealsScreen.tsx';
import EmailVerificationScreen from 'screens/EmailVerificationScreen.tsx';
import SuccessEmailVerificationScreen from 'screens/SuccessEmailVerificationScreen.tsx';
import ForgotPasswordScreen from 'screens/ForgotPasswordScreen.tsx';

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
          headerShown: false,
          headerTransparent: true,
        }}
        component={EmailVerificationScreen}
      />
      <AuthStack.Screen
        name={AppNavigation.FORGOT}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={ForgotPasswordScreen}
      />
    </AuthStack.Navigator>
  );
};

const AppNavigator = () => {
  const {maxMealPerDay, dailyCalories, goal} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );
  const state = useSelector((state: RootState) => state);
  console.log({maxMealPerDay, dailyCalories, goal});
  console.log('state1', state);
  const isFilledUserDetails = Boolean(maxMealPerDay && dailyCalories && goal);
  console.log('isFilledUserDetails', isFilledUserDetails);
  return (
    <AppStack.Navigator
      initialRouteName={
        isFilledUserDetails ? AppNavigation.HOME : AppNavigation.SETTINGS_STEPS
      }>
      <AppStack.Screen
        name={AppNavigation.SETTINGS_STEPS}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={SettingsStepsScreen}
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
        name={AppNavigation.SUCCESS_VERIFY}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={SuccessEmailVerificationScreen}
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
        name={AppNavigation.GOAL}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={GoalScreen}
      />
      <AppStack.Screen
        name={AppNavigation.PERSONAL_DATA}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={PersonalDataScreen}
      />
      <AppStack.Screen
        name={AppNavigation.MEAL_DATA}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={MealDataScreen}
      />
      <AppStack.Screen
        name={AppNavigation.FOOD_PREFERENCES}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={FoodPreferencesScreen}
      />
      <AppStack.Screen
        name={AppNavigation.DAILY_CALORIES}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={DailyCaloriesScreen}
      />
      <AppStack.Screen
        name={AppNavigation.MEAL_CALENDAR}
        options={{
          headerShown: false,
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
      <AppStack.Screen
        name={AppNavigation.SUBSCRIPTION}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
        component={SubscriptionScreen}
      />
    </AppStack.Navigator>
  );
};

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
