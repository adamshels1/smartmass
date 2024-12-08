import React, {memo} from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppNavigation, NavigationStackLists} from 'shared/config/navigation';
import WelcomeScreen from 'screens/WelcomeScreen.js';
import LoginScreen from 'features/Auth/ui/LoginScreen.tsx';

export const Stack = createNativeStackNavigator<NavigationStackLists>();

const Navigation = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName={AppNavigation.WELCOME}>
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
