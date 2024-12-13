import React from 'react';
import {View, StyleSheet} from 'react-native';
import DailyMeals from 'features/meal/ui/dailyMeals/DailyMeals.tsx';

const DailyMealsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <DailyMeals />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DailyMealsScreen;
