import {makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Для React Native

class ChatInputStore {
  inputText: string = '';

  constructor() {
    makeAutoObservable(this);

    // Настраиваем persist
    makePersistable(this, {
      name: 'ChatInputStore', // Уникальное имя
      properties: ['inputText'], // Свойства для сохранения
      storage: AsyncStorage, // Хранилище (AsyncStorage для React Native)
      debugMode: false, // Включите true, чтобы видеть отладочную информацию
    });
  }

  // Устанавливаем текст ввода
  setInputText(text: string) {
    this.inputText = text;
  }

  // Очищаем текст ввода
  clearInputText() {
    this.inputText = '';
  }
}

const chatInputStore = new ChatInputStore();
export default chatInputStore;
