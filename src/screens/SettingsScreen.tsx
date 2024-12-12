import React from 'react';
import {View, StyleSheet} from 'react-native';
import CalorieCalendar from 'features/meal/ui/CalorieCalendar';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <CalorieCalendar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
