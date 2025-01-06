import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Создаем instance axios
const apiInstance = axios.create({
  baseURL: 'http://13.61.4.143:3000/api', // Базовый URL для API
  timeout: 20000, // Таймаут запроса
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

// Настройка интерсепторов для обработки ошибок и добавления токенов
apiInstance.interceptors.request.use(
  async config => {
    // Получаем токен из AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Обработка ошибок
    console.error('API Error:', error.response);
    return Promise.reject(error);
  },
);

export default apiInstance;
