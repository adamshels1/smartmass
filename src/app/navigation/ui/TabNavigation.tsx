import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, StyleSheet, Platform} from 'react-native';
import {AppTabNavigation, NavigationTabLists} from 'shared/config/navigation';
import DailyMealsScreen from 'screens/DailyMealsScreen.tsx';
import CalorieCalendarScreen from 'screens/CalorieCalendarScreen.tsx';
import Cart from 'screens/CartScreen.tsx';
import {
  HomeIcon,
  SettingsIcon,
  CalendarIcon,
  CartIcon,
} from 'shared/assets/icons';
import SettingsScreen from 'screens/Settings/SettingsScreen.tsx';
import i18n from 'i18next';

const Tab = createBottomTabNavigator<NavigationTabLists>();
const isIos = Platform.OS === 'ios';

const TabNavigation: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#31D6D6', // Цвет активной вкладки
        tabBarInactiveTintColor: '#667085', // Цвет неактивной вкладки
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: isIos ? 20 : 10,
          backgroundColor: '#fff', // Цвет фона таб бара
          height: isIos ? 85 : 75, // Увеличиваем высоту таб бара
        },
      }}>
      <Tab.Screen
        name={AppTabNavigation.HOME}
        component={DailyMealsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <HomeIcon color={color} width={size} />
          ),
          tabBarLabel: ({color}) => (
            <Text style={[styles.label, {color: color}]}>
              {i18n.t('Главная')}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name={AppTabNavigation.CALENDAR}
        component={CalorieCalendarScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => <CalendarIcon color={color} />,
          tabBarLabel: ({color}) => (
            <Text style={[styles.label, {color: color}]}>{i18n.t('План')}</Text>
          ),
        }}
      />
      <Tab.Screen
        name={AppTabNavigation.CART}
        component={Cart}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <CartIcon width={size} height={size} color={color} />
          ),
          tabBarLabel: ({color}) => (
            <Text style={[styles.label, {color: color}]}>
              {i18n.t('Корзина')}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name={AppTabNavigation.SETTINGS}
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <SettingsIcon color={color} width={size} />
          ),
          tabBarLabel: ({color}) => (
            <Text style={[styles.label, {color: color}]}>
              {i18n.t('Настройки')}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 9,
  },
});

export default TabNavigation;
