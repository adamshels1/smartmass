// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // Используйте AsyncStorage
  whitelist: ['auth', 'meal', 'userDetails'], // Указываем, какие редюсеры нужно сохранять
};

export default persistConfig;
