import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {RootState} from 'app/providers/StoreProvider';
import {
  fetchDailyMeals,
  initiateGenerateDailyMeals,
} from 'entities/meal/model/slices/mealSlice';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import MealItem from './MealItem';
import {SkeletonLoader} from 'shared/ui';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';

type MealsListProps = {
  date: string;
};

const MealsList: React.FC<MealsListProps> = ({date}) => {
  const dispatch = useAppDispatch();
  const days = useSelector((state: RootState) => state.meal.days);
  const status = useSelector((state: RootState) => state.meal.status);
  const error = useSelector((state: RootState) => state.meal.error);
  const {maxMealPerDay, dailyCalories} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );

  useEffect(() => {
    dispatch(fetchDailyMeals({date: date}));
  }, [dispatch, date]);

  if (status === 'loading') {
    return <SkeletonLoader />;
  }

  // if (status === 'failed') {
  //   return <CustomText>Error: {error}</CustomText>;
  // }

  const meals =
    days?.length > 0 ? days?.find(day => day.date === date)?.meals : [];

  const handleGenerateMeals = () => {
    if (maxMealPerDay && dailyCalories) {
      dispatch(
        initiateGenerateDailyMeals({
          date: date,
          mealCount: Number(maxMealPerDay),
          totalCalories: Number(dailyCalories),
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={meals || []}
        renderItem={({item}) => <MealItem item={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.mealList}
        ListEmptyComponent={
          <CustomButton
            style={{marginBottom: 10}}
            title={'Получить диету на весь день'}
            onPress={handleGenerateMeals}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mealList: {
    paddingBottom: 20,
  },
});

export default MealsList;
