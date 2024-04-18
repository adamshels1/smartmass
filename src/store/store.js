// store.js
import { combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Используйте AsyncStorage для React Native

import userReducer from './userReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // Укажите AsyncStorage как хранилище
  whitelist: ['userData'] // Укажите, какие данные хотите сохранить в "белом списке"
};

const rootReducer = combineReducers({
  userData: userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);