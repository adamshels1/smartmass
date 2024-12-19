import {Provider, useSelector} from 'react-redux';
import React, {useState, useEffect} from 'react';
import {store} from '../store/store';
import {View, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Home from './src/screens/Home'

import WelcomeScreen from '../screens/WelcomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from 'screens/Settings/SettingsScreen';
import CartScreen from '../screens/CartScreen';
import SourcesScreen from '../screens/SourcesScreen';
import ProductByBarCodeScreen from '../screens/ProductByBarCodeScreen';

import {NotificationProvider} from 'app/providers/NotificationProvider';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // const [token, setToken] = useState(null);

  // useEffect(() => {
  //   AsyncStorage.getItem('token').then((value) => {
  //     setToken(value)
  //   })
  // }, [token])

  const isSignedIn = useSelector(state => state.userData.isSignedIn);
  const isShowWelcomeScreen = useSelector(
    state => state.userData.showWelcomeScreen,
  );

  return (
    <Provider store={store}>
      <NotificationProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {isShowWelcomeScreen && (
              <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
                options={{headerShown: false}}
              />
            )}
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SourcesScreen"
              component={SourcesScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProductByBarCodeScreen"
              component={ProductByBarCodeScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationProvider>
    </Provider>
  );

  // if (isSignedIn) {
  //   return (
  //     <Provider store={store}>
  //       <NavigationContainer>
  //         <Stack.Navigator>
  //           <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
  //           <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
  //           <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
  //         </Stack.Navigator>
  //       </NavigationContainer>
  //     </Provider>
  //   );
  // }

  // return (
  //   <Provider store={store}>
  //     <NavigationContainer>
  //       <Stack.Navigator>
  //         <Stack.Screen name="SingUp" component={SingUp} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   </Provider>
  // )
};

export default AppNavigator;
