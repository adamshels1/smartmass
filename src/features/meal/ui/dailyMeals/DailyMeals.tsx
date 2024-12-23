import React from 'react';
import {View, StyleSheet} from 'react-native';
import DateProgress from './DateProgress.tsx';
import MealsList from './MealsList.tsx';
import {useAppRoute} from 'shared/lib/navigation/useAppRoute.ts'; // Импортируем useAppRoute
import moment from 'moment';

const DailyMeals: React.FC = () => {
  const route = useAppRoute(); // Используем useAppRoute
  const date = route.params?.date || moment().format('YYYY-MM-DD'); // Устанавливаем текущую дату по умолчанию с использованием moment

  return (
    <View style={styles.container}>
      <DateProgress date={date} />
      <MealsList date={date} />
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
});

export default DailyMeals;
