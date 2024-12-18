import apiInstance from 'shared/api/apiInstance.ts';
import {UserDetails} from 'entities/userDetails/model/types/userDetailsTypes.ts';

// Функция для обновления данных пользователя
export const updateUserDetails = async (
  userDetails: UserDetails,
): Promise<void> => {
  try {
    await apiInstance.post('/userDetails/updateUserDetails', {userDetails});
    console.log('User details updated successfully');
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

// Функция для получения данных пользователя
export const getUserDetails = async (): Promise<UserDetails> => {
  try {
    const response = await apiInstance.get<UserDetails>(
      '/userDetails/getUserDetails',
    );
    return response.data;
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};
