import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CalorieCalendar from './CalorieCalendar.tsx';

const MealCalendarScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MealCalendar</Text>
      <CalorieCalendar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});

export default MealCalendarScreen;
