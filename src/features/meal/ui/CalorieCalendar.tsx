import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {fetchDaysWithMeals} from 'entities/meal/model/slices/mealSlice';
import {RootState} from 'app/providers/StoreProvider/config/store';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import moment from 'moment';
import {DayMeals} from 'entities/meal/model/types/mealTypes.ts';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import {AppNavigation} from 'shared/config/navigation';

const CalorieCalendar = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const daysWithMeals = useSelector((state: RootState) => state.meal.days);
  console.log('daysWithMeals', daysWithMeals);

  useEffect(() => {
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().endOf('month').format('YYYY-MM-DD');
    dispatch(fetchDaysWithMeals({startDate, endDate}));
  }, [dispatch]);

  const renderItem = ({item}: {item: DayMeals}) => {
    const progress =
      item?.takenCalories && item?.totalCalories
        ? item?.takenCalories / item?.totalCalories
        : 0;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(AppNavigation.DAILY_MEALS, {date: item.date})
        }
        style={styles.card}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{moment(item.date).format('DD')}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.day}>{moment(item.date).format('dddd')}</Text>
          <ProgressBar
            progress={progress}
            color={'#31D6D6'}
            style={styles.progressBar}
          />
          <Text style={styles.kcal}>{item?.takenCalories}kcal</Text>
        </View>
        <View style={styles.actionContainer}>
          <View style={styles.square} />
          <View style={styles.square} />
          <View style={styles.square} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    const lastDate = moment(daysWithMeals[daysWithMeals.length - 1].date);
    const nextDate = lastDate.add(1, 'day').format('YYYY-MM-DD');

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(AppNavigation.DAILY_MEALS, {date: nextDate})
        }
        style={[styles.card, styles.footerCard]}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{moment(nextDate).format('DD')}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.day}>{moment(nextDate).format('dddd')}</Text>
          <Text style={styles.day}>Запланировать рацион</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.month}>Ноябрь, 2024</Text>
      <Text style={styles.week}>Четвертая неделя</Text>
      <FlatList
        data={daysWithMeals}
        renderItem={renderItem}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.list}
        ListFooterComponent={renderFooter}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Получить диету на неделю</Text>
      </TouchableOpacity>
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
  month: {
    fontSize: 24,
    fontWeight: 'normal',
    marginBottom: 5,
  },
  week: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  dateContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  day: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 5,
  },
  progressBar: {
    height: 3,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  overrunBar: {
    position: 'absolute',
    top: 0,
    left: '100%',
    height: 6,
    width: 20,
    backgroundColor: 'red',
  },
  kcal: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100,
  },
  square: {
    width: 20,
    height: 20,
    backgroundColor: '#DDD',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#31D6D6',
    borderRadius: 33,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'normal',
  },
  footerCard: {
    borderColor: '#31D6D6',
    borderWidth: 1,
  },
});

export default CalorieCalendar;
