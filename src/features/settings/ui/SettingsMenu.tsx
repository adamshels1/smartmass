import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  AppDispatch,
  RootState,
} from 'app/providers/StoreProvider/config/store.ts';
import {useDispatch, useSelector} from 'react-redux';
import {fetchLogout} from 'entities/auth/model/authSlice.ts';
import {AppNavigation} from 'shared/config/navigation';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';

export const SettingsMenu: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  console.log('user', user);
  const navigation = useAppNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <Image
          source={{uri: 'https://via.placeholder.com/150'}} // Replace with actual avatar URL
          style={styles.avatar}
        />
        <View style={styles.userInfoTextContainer}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Меню</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(AppNavigation.GOAL)}
          style={styles.sectionItem}>
          <>
            <Text style={styles.sectionItemText}>Цель</Text>
            <Image
              style={styles.inputIcon}
              source={require('assets/icons/chevron-right.png')}
            />
          </>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(AppNavigation.PERSONAL_DATA)}
          style={styles.sectionItem}>
          <Text style={styles.sectionItemText}>Персональные данные</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionItem}
          onPress={() => navigation.navigate(AppNavigation.MEAL_DATA)}>
          <Text style={styles.sectionItemText}>Прием пищи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionItem}
          onPress={() => navigation.navigate(AppNavigation.FOOD_PREFERENCES)}>
          <Text style={styles.sectionItemText}>Пищевые предпочтения</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sectionItem}
          onPress={() => navigation.navigate(AppNavigation.DAILY_CALORIES)}>
          <Text style={styles.sectionItemText}>Количество калорий в день</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionItem}>
          <Text style={styles.sectionItemText}>Настройки аккаунта</Text>
        </TouchableOpacity>
      </View>

      <CustomButton title={'Выход'} onPress={() => dispatch(fetchLogout())} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionItemText: {
    fontSize: 15,
  },
  logoutButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputIcon: {
    width: 24,
    height: 24,
    top: 12,
    right: 15,
    position: 'absolute',
  },
});
