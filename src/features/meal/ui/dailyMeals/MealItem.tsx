import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RefreshIcon} from 'shared/assets/icons';
import ImagePexels from 'shared/ui/ImageByDescription/ui/ImagePixabay.tsx';
import {Meal} from 'entities/meal/model/types/mealTypes';

interface MealItemProps {
  item: Meal;
}

const MealItem: React.FC<MealItemProps> = ({item}) => (
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
      <Text style={styles.mealTime}>{item.time}</Text>
      <Text style={styles.mealKcal}>{item.dishCalories} ккал</Text>
    </View>
    <TouchableOpacity style={styles.refreshButton} onPress={() => {}}>
      <RefreshIcon width={25} height={25} fill={'gray'} />
    </TouchableOpacity>
  </View>
);

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
