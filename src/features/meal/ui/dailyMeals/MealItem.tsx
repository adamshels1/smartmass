import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment'; // Подключаем moment
import {RefreshIcon, CheckIcon} from 'shared/assets/icons';
import ImagePexels from 'shared/ui/ImageByDescription/ui/ImagePixabay.tsx';
import {Meal} from 'entities/meal/model/types/mealTypes';
import {
  initiateUpdateMeal,
  fetchDailyMeals,
} from 'entities/meal/model/slices/mealSlice';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {updateIsMealTaken} from 'entities/meal/model/api/mealApi.ts';
import {AppNavigation} from 'shared/config/navigation';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import {UpdateMealModal} from 'features/meal/ui/dailyMeals/UpdateMealModal.tsx';

interface MealItemProps {
  item: Meal;
}

const MealItem: React.FC<MealItemProps> = ({item}) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const isPastTime = moment(
    `${item.date} ${item.time}`,
    'YYYY-MM-DD HH:mm',
  ).isBefore(moment());
  const isCurrentMeal = moment().isBetween(
    moment(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm').add(-2, 'hours'),
    moment(`${item.date} ${item.time}`, 'YYYY-MM-DD HH:mm').add(0.5, 'hours'),
  );

  const getTimeUntilNextMeal = () => {
    const nextMealTime = moment(
      `${item.date} ${item.time}`,
      'YYYY-MM-DD HH:mm',
    );
    const now = moment();
    if (nextMealTime.isBefore(now)) {
      return 'Время настало';
    }
    const diff = moment.duration(nextMealTime.diff(now));
    const hours = diff.hours();
    const minutes = diff.minutes();
    return `${hours}ч ${minutes}м`;
  };

  let mealStyle: any = '';
  if (isPastTime) {
    mealStyle = styles.pastMeal;
  }
  if (isCurrentMeal) {
    mealStyle = styles.currentMeal;
  }

  const handleUpdateMeal = async () => {
    setLoading(true);
    try {
      await dispatch(initiateUpdateMeal(item.id));
      await dispatch(fetchDailyMeals({date: item.date}));
    } finally {
      setLoading(false);
    }
  };

  const renderRightButton = () => {
    if (item.isMealTaken) {
      return <CheckIcon width={25} height={25} fill={'green'} />;
    }
    if (!isPastTime && item.isPlanned) {
      return (
        <View>
          <UpdateMealModal item={item} />
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleUpdateMeal}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="gray" />
            ) : (
              <RefreshIcon width={25} height={25} />
            )}
          </TouchableOpacity>
        </View>
      );
    }
  };

  const handleUpdateIsMealTaken = async (taken: boolean) => {
    await updateIsMealTaken(item.id, taken);
    dispatch(fetchDailyMeals({date: item.date}));
  };

  const renderMealTakenButtons = () => {
    if (item.isMealTaken === null && isPastTime) {
      return (
        <View style={styles.mealActions}>
          <CustomText>Был ли принят прием пищи?</CustomText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleUpdateIsMealTaken(true)}
              style={styles.button}>
              <CustomText>Да</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdateIsMealTaken(false)}
              style={styles.button}>
              <CustomText>Нет</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <>
      {isCurrentMeal && (
        <CustomText style={styles.timer}>
          До следующего приема пищи: {getTimeUntilNextMeal()}
        </CustomText>
      )}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(AppNavigation.MEAL_DETAILS, {mealId: item.id})
        }
        style={[styles.mealCard, mealStyle]}>
        <ImagePexels
          description={item.dishEn}
          imageStyle={styles.mealImage}
          width={80}
          height={80}
        />
        <View style={styles.mealInfo}>
          <CustomText style={styles.mealTime}>
            {item.time} - {item.name}
          </CustomText>
          <CustomText style={styles.mealTime}>{item.dish}</CustomText>
          <CustomText style={styles.mealKcal}>
            {item.dishCalories} ккал
          </CustomText>
          {renderMealTakenButtons()}
        </View>

        <View style={styles.rightButtonWrap}>{renderRightButton()}</View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  pastMeal: {
    opacity: 0.7,
  },
  currentMeal: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 10,
  },
  mealTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  mealKcal: {
    fontSize: 14,
    color: '#888',
  },
  mealActions: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  button: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    width: 70,
    alignItems: 'center',
  },
  refreshButton: {
    padding: 10,
  },
  rightButtonWrap: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 14,
    color: 'red',
    marginBottom: 5,
    marginTop: 5,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});

export default MealItem;
