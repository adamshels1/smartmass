import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
export const setToken = async (fcmToken: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    let deviceId = await DeviceInfo.getUniqueId();

    const response = await axios.post(
      'https://app.dev.rad.codesmith.space/api/model-objects/objects/firebase/token',
      {
        deviceId: deviceId, // Ваш deviceId
        token: fcmToken, // Ваш token
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('response set token', response);

    // Обработка ответа, если необходимо
  } catch (error) {
    console.error('Error fetching Firebase token:', error);
  }
};
