import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {RefreshIcon} from 'shared/assets/icons';
import ImagePexels from 'shared/ui/ImageByDescription/ui/ImagePixabay.tsx';
import {Meal} from 'entities/meal/model/types/mealTypes';
import {
  initiateUpdateMeal,
  fetchDailyMeals,
} from 'entities/meal/model/slices/mealSlice';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';

interface MealItemProps {
  item: Meal;
}

const MealItem: React.FC<MealItemProps> = ({item}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleUpdateMeal = async () => {
    setLoading(true);
    try {
      await dispatch(initiateUpdateMeal(item));
      await dispatch(fetchDailyMeals({date: item.date, userId: 1}));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mealCard}>
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
      </View>
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
    </View>
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
  refreshButton: {
    padding: 10,
  },
});

export default MealItem;
