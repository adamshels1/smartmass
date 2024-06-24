import moment from 'moment';
import {createTriggerNotification} from 'entities/notification';
import notifee from '@notifee/react-native';
import {Meal} from 'features/chat/model/types/diet.ts';

export const scheduleMealtimeNotifications = async (
  diet: Meal[],
  date: string,
) => {
  try {
    diet.map(item => {
      const datetime = moment(
        moment(date).format('YYYY-MM-DD') + ' ' + item.time,
        'YYYY-MM-DD HH:mm',
      );

      createTriggerNotification(
        datetime.valueOf(),
        item.name + ' в ' + item.time,
        item.dish + ' - ' + item.dishCalories,
      );
    });

    await notifee.requestPermission();
    //create channel for android
    await notifee.createChannel({
      id: 'mealtime',
      name: 'Default Channel',
      sound: 'doorbell',
    });
  } catch (e) {
    console.log('e', e);
  }
};
