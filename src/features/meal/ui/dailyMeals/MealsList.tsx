import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, FlatList} from 'react-native';
import {RootState} from 'app/providers/StoreProvider';
import {fetchDailyMeals} from 'entities/meal/model/slices/mealSlice';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import MealItem from './MealItem';
import {SkeletonLoader} from 'shared/ui';
import {GetDailyMealsModal} from 'features/meal/ui/dailyMeals/GetDailyMealsModal.tsx';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import moment from 'moment/moment';
import {AppNavigation} from 'shared/config/navigation';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';

type MealsListProps = {
  date: string;
};

const MealsList: React.FC<MealsListProps> = ({date}) => {
  const dispatch = useAppDispatch();
  const days = useSelector((state: RootState) => state.meal.days);
  const generateMealsStatus = useSelector(
    (state: RootState) => state.meal.generateMealsStatus,
  );
  const navigation = useAppNavigation();
  // const error = useSelector((state: RootState) => state.meal.error);

  useEffect(() => {
    dispatch(fetchDailyMeals({date: date}));
  }, [dispatch, date]);

  if (generateMealsStatus === 'loading') {
    return <SkeletonLoader />;
  }

  // if (status === 'failed') {
  //   return <CustomText>Error: {error}</CustomText>;
  // }

  const meals =
    days?.length > 0 ? days?.find(day => day.date === date)?.meals : [];

  const renderNextButton = () => {
    if (meals && meals?.length) {
      return (
        <CustomButton
          title={'Следующий день'}
          onPress={() => {
            const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
            navigation.navigate(AppNavigation.DAILY_MEALS, {
              date: nextDate,
            });
          }}
        />
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
        ListEmptyComponent={<GetDailyMealsModal date={date} />}
        ListFooterComponent={renderNextButton()}
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
