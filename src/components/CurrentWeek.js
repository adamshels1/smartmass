import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import moment from 'moment';
import {useSelector} from 'react-redux';

const CurrentWeek = ({onDateSelect, selectedDate}) => {
  // Получаем текущую дату без времени
  const currentDate = moment().startOf('day');
  const days = useSelector(state => state.userData.days);
  // const currentDate = moment('2024-04-25');

  // Получаем начало текущей недели (воскресенье)
  const startOfWeek = currentDate.clone().startOf('week');

  // Создаем массив с датами текущей недели и названиями дней недели
  const weekDays = [];
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  for (let i = 0; i < 7; i++) {
    const day = startOfWeek.clone().add(i, 'days').startOf('day'); // Форматируем дату без времени

    const dayData = days.find(i => day.isSame(i.date, 'day'));
    weekDays.push({day, name: dayNames[i], ...dayData});
  }
  console.log('weekDays', weekDays);

  // Функция для проверки, является ли день будущим
  const isSameFutureDay = day => {
    return day.isSameOrAfter(currentDate);
  };

  return (
    <View style={styles.container}>
      {weekDays.map(({day, name, diet}, index) => (
        <View style={{alignItems: 'center'}}>
          <Text
            style={[
              styles.dayName,
              {color: currentDate.isSame(day, 'day') ? '#67CFCF' : '#D3D3D3'},
            ]}>
            {name}
          </Text>
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              day.isSame(selectedDate, 'day')
                ? styles.activeDay
                : styles.inactiveDay,
              {opacity: isSameFutureDay(day) ? 1 : 0.5},
            ]}
            onPress={() => onDateSelect(day.format('YYYY-MM-DD'))}
            disabled={!isSameFutureDay(day)}>
            <Text style={styles.dayText}>{day.format('D')}</Text>
          </TouchableOpacity>
          {isSameFutureDay(day) && (
            <View style={{marginTop: 5, flexDirection: 'row'}}>
              <Image
                style={{width: 15, height: 15}}
                source={
                  diet
                    ? require('../assets/icons/cutlery.png')
                    : require('../assets/icons/cart_inactive.png')
                }
              />

              <Image
                style={{width: 15, height: 15}}
                source={require('../assets/icons/cart_inactive.png')}
              />
            </View>
          )}

          {currentDate.isSame(day, 'day') && (
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#67CFCF',
                marginTop: 3,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingBottom: 5,
  },
  dayButton: {
    width: 40,
    height: 40, // Увеличил высоту для вмещения названия дня
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDay: {
    backgroundColor: '#67CFCF',
  },
  inactiveDay: {
    backgroundColor: '#D3D3D3', // Серый цвет для неактивных дней
  },
  dayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
  dayName: {
    color: '#D3D3D3', // Цвет названия дня
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4, // Отступ между числом и названием дня
  },
});

export default CurrentWeek;
