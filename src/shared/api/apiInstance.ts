import axios from 'axios';

// Создаем instance axios
const apiInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Базовый URL для API
  timeout: 20000, // Таймаут запроса
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

// Настройка интерсепторов для обработки ошибок и добавления токенов
apiInstance.interceptors.request.use(
  config => {
    // Здесь можно добавить токены аутентификации
    const token = ''; // Получите токен из состояния или локального хранилища
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
