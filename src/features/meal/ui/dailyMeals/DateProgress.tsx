import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BurgerIcon} from 'shared/assets/icons';
import {ProgressBar} from 'react-native-paper';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider';
import moment from 'moment';
import {SkeletonLoader} from 'shared/ui';
import UnplannedMealModal from 'features/meal/ui/dailyMeals/UnplannedMealModal.tsx';

interface DateProgressComponentProps {
  date: string;
}

const DateProgress: React.FC<DateProgressComponentProps> = ({date}) => {
  const days = useSelector((state: RootState) => state.meal.days);
  const status = useSelector((state: RootState) => state.meal.status);

  const day = days.find(day => day.date === date);

  // if (status === 'loading') {
  //   return <SkeletonLoader length={1} />;
  // }

  const progress = day?.takenCalories ? day?.takenCalories : 0 / 3000;

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
          <Text style={styles.kcalProgress}>100</Text>
        </View>
      </View>

      <UnplannedMealModal />
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
