import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider';
import moment from 'moment';
import UnplannedMealModal from 'features/meal/ui/dailyMeals/UnplannedMealModal.tsx';

interface DateProgressComponentProps {
  date: string;
}

const DateProgress: React.FC<DateProgressComponentProps> = ({date}) => {
  const days = useSelector((state: RootState) => state.meal.days);
  console.log('days', days);

  const day = days?.find(day => day.date === date);
  console.log('day', day);

  const progress =
    day?.takenCalories && day?.totalCalories
      ? day?.takenCalories / day?.totalCalories
      : 0;

  console.log('progress', progress);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.dateText}>
          {moment(date).format('DD MMMM, dddd')}
        </Text>
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={'#31D6D6'}
            style={styles.progressBar}
          />
          <Text style={styles.kcalProgress}>{day?.takenCalories} kcal</Text>
        </View>
      </View>

      <UnplannedMealModal date={date} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'normal',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  progressBar: {
    height: 3,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    width: 150,
    marginRight: 12,
  },
  kcalProgress: {
    fontSize: 14,
  },
});

export default DateProgress;
