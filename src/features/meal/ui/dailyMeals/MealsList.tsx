import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {RootState} from 'app/providers/StoreProvider';
import {fetchDailyMeals} from 'entities/meal/model/slices/mealSlice';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import MealItem from './MealItem';
import {SkeletonLoader} from 'shared/ui';

const MealsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const days = useSelector((state: RootState) => state.meal.days);
  const status = useSelector((state: RootState) => state.meal.status);
  const error = useSelector((state: RootState) => state.meal.error);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(fetchDailyMeals({date: today, userId: 1}));
  }, [dispatch]);

  if (status === 'loading') {
    return <SkeletonLoader />;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  const todayMeals =
    days.length > 0
      ? days.find(day => day.date === new Date().toISOString().split('T')[0])
          ?.meals
      : [];

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>До следующего приема пищи: 2ч 31м</Text>
      <FlatList
        data={todayMeals || []}
        renderItem={({item}) => <MealItem item={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.mealList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timer: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  mealList: {
    paddingBottom: 20,
  },
});

export default MealsList;
