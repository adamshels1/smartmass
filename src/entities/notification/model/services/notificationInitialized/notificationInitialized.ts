import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {setToken} from '../../api/notificationApi.ts';

export const notificationInitialized = async () => {
  try {
    // Запрос разрешений на отправку уведомлений
    await notifee.requestPermission();

    // Регистрация устройства для получения удаленных сообщений
    await messaging().registerDeviceForRemoteMessages();

    // Получение токена FCM
    const token = await messaging().getToken();
    console.log('fcm_token', token);

    // Сохранение токена в вашем backend API

    await setToken(token);

    // Создание канала уведомлений для Android
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default', // Установите звук по умолчанию
      vibration: true, // Включите вибрацию
      vibrationPattern: [200, 100, 200, 100, 200], // Укажите паттерн вибрации
    });

    // Обработчик получения сообщения, когда приложение находится в foreground
    messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);

      if (remoteMessage.notification) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [200, 100, 200, 100, 200], // Убедитесь, что паттерн вибрации установлен
            pressAction: {
              id: 'default',
            },
          },
        });
      }
    });

    // Обработчик нажатия на уведомление
    // notifee.onBackgroundEvent(async ({type, detail}) => {
    //   const {notification, pressAction} = detail;
    //   if (type === notifee.EventType.PRESS) {
    //     // Обработайте нажатие на уведомление здесь
    //   }
    // });
  } catch (error) {
    console.log('fcm_token error', error);
  }
};
