import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CalorieCalendar from './CalorieCalendar.tsx';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

const MealCalendarScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>MealCalendar</CustomText>
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
