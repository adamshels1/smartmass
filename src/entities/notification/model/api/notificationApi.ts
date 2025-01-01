import DeviceInfo from 'react-native-device-info';
import apiInstance from 'shared/api/apiInstance.ts';
export const setToken = async (fcmToken: string) => {
  try {
    let deviceId = await DeviceInfo.getUniqueId();

    const response = await apiInstance.post<any>(
      '/firebaseToken/saveFirebaseToken',
      {
        deviceId: deviceId, // Ваш deviceId
        firebaseToken: fcmToken, // Ваш token
      },
    );
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.error('Error generating daily meals:', error);
    throw error;
  }
};
