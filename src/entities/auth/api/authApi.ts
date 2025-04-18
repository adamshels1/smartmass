import apiInstance from 'shared/api/apiInstance.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResponse,
  VerifyEmailResponse,
} from 'entities/auth/types/authTypes.ts';
import {getTimeZone} from 'react-native-localize';
import {getLocalize} from 'shared/lib/intl/getLocalize';
import {LanguageType} from 'shared/config/i18n';

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in with email:', error);
    throw error;
  }
};

export const signInWithGoogle = async (
  idToken: string,
): Promise<AuthResponse> => {
  try {
    const timezone = getTimeZone(); // Получаем временную зону
    const language = getLocalize<LanguageType>();
    const referralId = await AsyncStorage.getItem('referralId');
    const response = await apiInstance.post<AuthResponse>('/auth/googleAuth', {
      idToken,
      timezone,
      language,
      referralId,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

export const signInWithApple = async (
  idToken: string,
  name: string,
): Promise<AuthResponse> => {
  try {
    const timezone = getTimeZone(); // Получаем временную зону
    const language = getLocalize<LanguageType>();
    const referralId = await AsyncStorage.getItem('referralId');
    const response = await apiInstance.post<AuthResponse>('/auth/appleAuth', {
      idToken,
      name,
      timezone,
      language,
      referralId,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in with Apple:', error);
    throw error;
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  try {
    const timezone = getTimeZone(); // Получаем временную зону
    const language = getLocalize<LanguageType>();
    const referralId = await AsyncStorage.getItem('referralId');
    const response = await apiInstance.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
      timezone,
      language,
      referralId,
    });
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.error('Error registering with email:', error);
    throw error;
  }
};

export const registerWithGoogle = async (
  idToken: string,
): Promise<AuthResponse> => {
  try {
    const referralId = await AsyncStorage.getItem('referralId');
    const response = await apiInstance.post<AuthResponse>('/auth/googleAuth', {
      idToken,
      referralId,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering with Google:', error);
    throw error;
  }
};

export const verifyEmail = async (
  email: string,
  code: string,
): Promise<VerifyEmailResponse> => {
  try {
    const response = await apiInstance.post<VerifyEmailResponse>(
      '/auth/verifyEmail',
      {
        email,
        code,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error verifying email:', error);
    throw error.response?.data || {message: 'An unknown error occurred'};
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await apiInstance.post('/auth/forgotPassword', {
      email,
    });
    console.log('Password reset email sent:', response.data);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw error.response?.data || {message: 'An unknown error occurred'};
  }
};

// Пример вызова функции
