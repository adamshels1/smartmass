import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider/config/store.ts';
import {fetchLogout} from 'entities/auth/model/authSlice.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import MenuItem from './MenuItem.tsx';
import {AppNavigation} from 'shared/config/navigation';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx'; // Adjust the import path

export const SettingsMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Настройки</CustomText>

      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <Image
          source={{uri: 'https://via.placeholder.com/150'}} // Replace with actual avatar URL
          style={styles.avatar}
        />
        <View style={styles.userInfoTextContainer}>
          <CustomText style={styles.userName}>{user?.name}</CustomText>
          <CustomText style={styles.userEmail}>{user?.email}</CustomText>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.sectionContainer}>
        <CustomText style={styles.sectionTitle}>Меню</CustomText>
        <MenuItem title="Цель" navigationTarget={AppNavigation.GOAL} />
        <MenuItem
          title="Персональные данные"
          navigationTarget={AppNavigation.PERSONAL_DATA}
        />
        <MenuItem
          title="Прием пищи"
          navigationTarget={AppNavigation.MEAL_DATA}
        />
        <MenuItem
          title="Пищевые предпочтения"
          navigationTarget={AppNavigation.FOOD_PREFERENCES}
        />
        <MenuItem
          title="Количество калорий в день"
          navigationTarget={AppNavigation.DAILY_CALORIES}
        />
        {/*<MenuItem*/}
        {/*  title="Настройки аккаунта"*/}
        {/*  navigationTarget={AppNavigation.ACCOUNT_SETTINGS}*/}
        {/*/>*/}
      </View>

      <CustomButton title={'Выход'} onPress={() => dispatch(fetchLogout())} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'normal',
    marginBottom: 24,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#777777',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
});
