import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {setToken} from '../../api/notificationApi.ts';

export const notificationInitialized = async () => {
  try {
    await notifee.requestPermission();
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('fcm_token', token);

    await setToken(token);
  } catch (error) {
    console.log('fcm_token error', error);
  }
};
