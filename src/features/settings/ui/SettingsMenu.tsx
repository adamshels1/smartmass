import React from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider/config/store.ts';
import {fetchLogout} from 'entities/auth/model/authSlice.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import MenuItem from './MenuItem.tsx';
import {AppNavigation} from 'shared/config/navigation';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import i18n from 'i18next';
import {DeleteAccountButton} from 'features/settings/ui/DeleteAccountButton.tsx'; // Adjust the import path

export const SettingsMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  return (
    <ScrollView style={styles.container}>
      <CustomText style={styles.title}>{i18n.t('Настройки')}</CustomText>

      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <Image
          source={require('shared/assets/images/avatar.png')} // Replace with actual avatar URL
          style={styles.avatar}
        />
        <View style={styles.userInfoTextContainer}>
          <CustomText style={styles.userName}>{user?.name}</CustomText>
          <CustomText style={styles.userEmail}>{user?.email}</CustomText>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.sectionContainer}>
        <MenuItem
          title={i18n.t('Цель')}
          navigationTarget={AppNavigation.GOAL}
        />
        <MenuItem
          title={i18n.t('Персональные данные')}
          navigationTarget={AppNavigation.PERSONAL_DATA}
        />
        <MenuItem
          title={i18n.t('Прием пищи')}
          navigationTarget={AppNavigation.MEAL_DATA}
        />
        <MenuItem
          title={i18n.t('Пищевые предпочтения')}
          navigationTarget={AppNavigation.FOOD_PREFERENCES}
        />
        <MenuItem
          title={i18n.t('Количество калорий в день')}
          navigationTarget={AppNavigation.DAILY_CALORIES}
        />
        <MenuItem
          title={i18n.t('Information Sources')}
          navigationTarget={AppNavigation.SOURCES}
        />
        <DeleteAccountButton />
        {/*<MenuItem*/}
        {/*  title={i18n.t('Подписка')}
        {/*  navigationTarget={AppNavigation.SUBSCRIPTION}*/}
        {/*/>*/}
        {/*<MenuItem*/}
        {/*  title={i18n.t('Настройки аккаунта')}
        {/*  navigationTarget={AppNavigation.ACCOUNT_SETTINGS}*/}
        {/*/>*/}
      </View>

      <CustomButton
        title={i18n.t('Выход')}
        onPress={() => dispatch(fetchLogout())}
      />
    </ScrollView>
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
    marginTop: 4,
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
