import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import {setTooltipStep} from '../store/userActions';
import i18n from '../shared/config/i18n';

const isNextDay2 = day => {
  const tomorrow = moment().add(1, 'day').startOf('day');
  return moment(day).isSame(tomorrow, 'day');
};

const CurrentWeek = ({
  onDateSelect,
  selectedDate,
  toolTipVisible,
  setToolTipVisible,
}) => {
  const tooltipStep = useSelector(state => state.userData.tooltipStep);
  // Получаем текущую дату без времени
  const dispatch = useDispatch();
  const currentDate = moment().startOf('day');
  const days = useSelector(state => state.userData.days);
  // const [toolTipVisible, setToolTipVisible] = useState(true);
  // const currentDate = moment('2024-04-25');

  // Получаем начало текущей недели (воскресенье)
  const startOfWeek = currentDate.clone().startOf('week'); //Убери day(1) для американцев
  // const startOfWeek = currentDate.clone();

  // Создаем массив с датами текущей недели и названиями дней недели
  const weekDays = [];
  const dayNames = [
    i18n.t('Sun'), // Вс
    i18n.t('Mon'), // Пн
    i18n.t('Tue'), // Вт
    i18n.t('Wed'), // Ср
    i18n.t('Thu'), // Чт
    i18n.t('Fri'), // Пт
    i18n.t('Sat'), // Сб
  ];
  for (let i = 0; i < 7; i++) {
    const day = startOfWeek.clone().add(i, 'days').startOf('day'); // Форматируем дату без времени

    const dayData = days.find(i => day.isSame(i.date, 'day'));
    weekDays.push({day, name: dayNames[i], ...dayData});
  }
  // console.log('weekDays', weekDays);

  // Функция для проверки, является ли день будущим
  const isSameFutureDay = day => {
    return day.isSameOrAfter(currentDate);
  };

  return (
    <View style={styles.container}>
      {weekDays.map(({day, name, diet}, index) => {
        const isNextDay = isNextDay2(day);
        return (
          <Tooltip
            key={index}
            animated={true}
            // (Optional) When true,
            // tooltip will animate in/out when showing/hiding
            arrowSize={{width: 16, height: 8}}
            // (Optional) Dimensions of arrow bubble pointing
            // to the highlighted element
            backgroundColor="rgba(0,0,0,0.5)"
            // (Optional) Color of the fullscreen background
            // beneath the tooltip.
            isVisible={isNextDay && tooltipStep === 'showNexDayButton'}
            // (Must) When true, tooltip is displayed
            content={
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#505050',
                    fontWeight: '300',
                  }}>
                  {i18n.t('Select next date')}
                </Text>
              </View>
            }
            // (Must) This is the view displayed in the tooltip
            placement="bottom"
            // (Must) top, bottom, left, right, auto.
            onClose={() => dispatch(setTooltipStep('showCartButton'))}
            // (Optional) Callback fired when the user taps the tooltip
          >
            <View style={{alignItems: 'center'}}>
              <Text
                style={[
                  styles.dayName,
                  {
                    color: currentDate.isSame(day, 'day')
                      ? '#67CFCF'
                      : '#D3D3D3',
                  },
                ]}>
                {name}
              </Text>
              <TouchableOpacity
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
                        : require('../assets/icons/cutlery-inactive.png')
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
          </Tooltip>
        );
      })}
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
