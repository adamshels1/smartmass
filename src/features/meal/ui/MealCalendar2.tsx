import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

type DataItem = {
  day: string;
  date: string;
  kcal: number;
  progress: number;
};

const data: DataItem[] = [
  {day: 'Понедельник', date: '18', kcal: 2456, progress: 1.2},
  {day: 'Вторник', date: '19', kcal: 2456, progress: 0.8},
  {day: 'Среда', date: '20', kcal: 2456, progress: 1.0},
  {day: 'Четверг', date: '21', kcal: 2456, progress: 1.4},
  {day: 'Пятница', date: '22', kcal: 2456, progress: 0.9},
  {day: 'Суббота', date: '23', kcal: 2456, progress: 1.1},
  {day: 'Воскресенье', date: '24', kcal: 2456, progress: 1.0},
];

const MealCalendar = () => {
  const renderItem = ({item}: {item: DataItem}) => (
    <View style={styles.card}>
      <View style={styles.dateContainer}>
        <CustomText style={styles.date}>{item.date}</CustomText>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.day}>{item.day}</Text>
        <ProgressBar
          progress={item.progress > 1 ? 1 : item.progress}
          color={item.progress > 1 ? 'red' : '#31D6D6'}
          style={styles.progressBar}
        />
        {item.progress > 1 && <View style={styles.overrunBar} />}
        <Text style={styles.kcal}>{item.kcal}kcal</Text>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.square} />
        <View style={styles.square} />
        <View style={styles.square} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.month}>Ноябрь, 2024</Text>
      <Text style={styles.week}>Четвертая неделя</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.list}
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
    paddingTop: 40,
  },
  month: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
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
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MealCalendar;
