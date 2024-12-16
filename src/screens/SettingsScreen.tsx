import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import CalorieCalendar from 'features/meal/ui/CalorieCalendar';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {fetchLogout} from 'entities/auth/model/authSlice.ts';

const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <View style={styles.container}>
      <CalorieCalendar />
      <TouchableOpacity onPress={() => dispatch(fetchLogout())}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
