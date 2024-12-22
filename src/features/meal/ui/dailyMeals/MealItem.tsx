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

interface MealItemProps {
  item: Meal;
}

const MealItem: React.FC<MealItemProps> = ({item}) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);
  const isPastTime = moment(item.time, 'HH:mm').isBefore(moment());
  const isCurrentMeal = moment().isBetween(
    moment(item.time, 'HH:mm'),
    moment(item.time, 'HH:mm').add(1, 'hours'), // Предполагаем, что текущий прием пищи длится 1 час
  );

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
      await dispatch(initiateUpdateMeal(item));
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
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleUpdateMeal}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="gray" />
          ) : (
            <RefreshIcon width={25} height={25} fill={'gray'} />
          )}
        </TouchableOpacity>
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
          <Text>Был ли принят прием пищи?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleUpdateIsMealTaken(true)}
              style={styles.button}>
              <Text>Да</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdateIsMealTaken(false)}
              style={styles.button}>
              <Text>Нет</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
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
        <Text style={styles.mealTime}>
          {item.time} - {item.name}
        </Text>
        <Text style={styles.mealTime}>{item.dish}</Text>
        <Text style={styles.mealKcal}>{item.dishCalories} ккал</Text>
        {renderMealTakenButtons()}
      </View>

      <View style={styles.rightButtonWrap}>{renderRightButton()}</View>
    </TouchableOpacity>
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
    // borderColor: 'green',
    // borderWidth: 1,
    opacity: 0.7,
  },
  currentMeal: {
    // backgroundColor: '#FFEB3B', // Светло-желтый цвет для выделения текущего приема пищи
    // Тень для Android
    elevation: 5,
    // Тень для iOS
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
});

export default MealItem;
