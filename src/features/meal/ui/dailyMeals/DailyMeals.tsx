import React from 'react';
import {View, StyleSheet} from 'react-native';
import DateProgress from './DateProgress.tsx';
import MealsList from './MealsList.tsx';
import {initiateGenerateDailyMeals} from 'entities/meal/model/slices/mealSlice.ts';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';

const DailyMeals: React.FC = () => {
  const dispatch = useAppDispatch();
  const date = new Date().toISOString().split('T')[0];
  const handleGenerateMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(
      initiateGenerateDailyMeals({
        date: today,
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
    paddingTop: 40,
  },
});

export default DailyMeals;
