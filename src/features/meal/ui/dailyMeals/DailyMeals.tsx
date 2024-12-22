import React from 'react';
import {View, StyleSheet} from 'react-native';
import DateProgress from './DateProgress.tsx';
import MealsList from './MealsList.tsx';
import {initiateGenerateDailyMeals} from 'entities/meal/model/slices/mealSlice.ts';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {useAppRoute} from 'shared/lib/navigation/useAppRoute.ts'; // Импортируем useAppRoute
import moment from 'moment';

const DailyMeals: React.FC = () => {
  const dispatch = useAppDispatch();
  const route = useAppRoute(); // Используем useAppRoute
  const date = route.params?.date || moment().format('YYYY-MM-DD'); // Устанавливаем текущую дату по умолчанию с использованием moment

  const handleGenerateMeals = () => {
    dispatch(
      initiateGenerateDailyMeals({
        date: date,
        mealCount: 3,
        totalCalories: 3000,
        userId: 1,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <DateProgress date={date} />
      <MealsList date={date} />
      {/*<CustomButton title={'Добавить продукты в корзину'} onPress={() => {}} />*/}
      <CustomButton
        style={{marginBottom: 10}}
        title={'Другая диета на весь день'}
        onPress={handleGenerateMeals}
      />
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
