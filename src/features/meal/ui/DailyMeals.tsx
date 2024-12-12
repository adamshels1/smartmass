import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RefreshIcon} from 'shared/assets/icons';
import DateProgressComponent from './DateProgressComponent.tsx';

const meals = [
  {
    time: '9:00',
    label: 'Завтрак',
    name: 'Каша овсяная на молоке с изюмом',
    kcal: 350,
    image: 'https://via.placeholder.com/100',
  },
  {
    time: '13:00',
    label: 'Обед',
    name: 'Суп куриный с лапшой',
    kcal: 260,
    image: 'https://via.placeholder.com/100',
  },
  {
    time: '18:00',
    label: 'Ужин',
    name: 'Паста с курицей и овощами',
    kcal: 450,
    image: 'https://via.placeholder.com/100',
  },
];

const DailyMeals: React.FC = () => {
  const renderItem = ({item}) => (
    <View style={styles.mealCard}>
      <Image source={{uri: item.image}} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealTime}>
          {item.time} - {item.label}
        </Text>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealKcal}>{item.kcal} ккал</Text>
      </View>
      <TouchableOpacity style={styles.refreshButton}>
        {/*<Text style={styles.refreshText}>⟳</Text>*/}
        <RefreshIcon width={25} height={25} fill={'gray'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <DateProgressComponent
        date="24 ноября, Воскресенье"
        progress={0.2}
        kcal="0 / 2456 ккал"
      />

      <Text style={styles.timer}>До следующего приема пищи: 2ч 31м</Text>
      <FlatList
        data={meals}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.mealList}
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Добавить продукты в корзину</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.otherButton}>
        <Text style={styles.otherButtonText}>Другая диета на весь день</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  header: {
    marginBottom: 10,
  },
  kcalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  kcalProgress: {
    fontSize: 16,
    color: '#555',
  },
  kcalIcon: {
    marginLeft: 10,
    fontSize: 24,
  },
  timer: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  mealList: {
    paddingBottom: 20,
  },
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
  mealName: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 5,
  },
  mealKcal: {
    fontSize: 14,
    color: '#888',
  },
  refreshButton: {
    padding: 10,
  },
  refreshText: {
    fontSize: 20,
    color: '#007AFF',
  },
  addButton: {
    backgroundColor: '#31D6D6',
    borderRadius: 33,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'normal',
  },
  otherButton: {
    borderColor: '#31D6D6',
    borderWidth: 1,
    borderRadius: 33,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  otherButtonText: {
    fontSize: 16,
    color: '#31D6D6',
    fontWeight: 'normal',
  },
});

export default DailyMeals;
