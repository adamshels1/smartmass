import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

const { GoogleGenerativeAI } = require('@google/generative-ai');
import Markdown from 'react-native-markdown-display';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Инициализация GoogleGenerativeAI
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');

export default function ChatScreen() {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null); // Создание рефа


  // Обработка отправки сообщения
  const handleSubmit = async () => {
    if (messageText.trim() === '') return; // Не отправляем пустые сообщения
    try {
      // Получение модели для генерации ответа
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Добавляем сообщение пользователя в список сообщений
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', parts: [{ text: messageText }] },
      ]);

      // Очистка поля ввода после отправки
      setMessageText('');

      await sleep(100)

      flatListRef.current.scrollToEnd({ animated: true });

      const context = {
        weight: 55, // Assuming weight is a number
        height: 175, // Assuming height is a number
        goal: 'Набрать вес',
        allergies: ['свинина'],
        likedDishes: ['Блины'], // Add an empty array for liked dishes
      };

      // Запуск чата с предыдущей историей сообщений и текущим входящим сообщением
      console.log('body', {
        history: messages,
        message: messageText,
        context
      })

      const chat = model.startChat({
        history: messages,
        message: messageText,
        generationConfig: {
          maxOutputTokens: 100,
        },
      });

      // Отправка сообщения и получение ответа
      const result = await chat.sendMessage(messageText);
      const response = await result.response;
      const text = await response.text();

      console.log('text', text);

      // Обновляем соответствующее сообщение с ответом модели
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'model', parts: [{ text }] },
      ]);

      await sleep(100)

      // Прокрутка списка вниз
      flatListRef.current.scrollToEnd({ animated: true });

    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleSubmit2 = async () => {
    const context = {
      weight: 55, // Assuming weight is a number
      height: 175, // Assuming height is a number
      goal: ['Набор веса', 'Разпозновать пищевую ценность продуктов питания'],
      description: ['давай короткие ответы на рецепты'],
      allergies: ['свинина'],
      likedDishes: ['Блины'], // Add an empty array for liked dishes
    };

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = 'Что можно покушать на завтрак из того что я люблю';

    // Добавляем сообщение пользователя в список сообщений
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', parts: [{ text: messageText }] },
    ]);

    // Очистка поля ввода после отправки
    setMessageText('');

    await sleep(100)

    flatListRef.current.scrollToEnd({ animated: true });

    const result = await model.generateContent(JSON.stringify({ prompt: messageText, context }));
    const response = await result.response;
    const text = response.text();
    console.log(text);

    // Обновляем соответствующее сообщение с ответом модели
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'model', parts: [{ text }] },
    ]);

    await sleep(100)

    // Прокрутка списка вниз
    flatListRef.current.scrollToEnd({ animated: true });
  };

  // Рендеринг элемента сообщения
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.role === 'user' ? styles.userMessage : styles.otherMessage,
      ]}>

      <Markdown style={{ body: item.role === 'user' ? styles.userMessageText : styles.otherMessageText }}>
        {item.parts[0].text}
      </Markdown>

    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.container}>

          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 35}}>
            <View />
            <Text>Nutrition consultant GPT</Text>
            <TouchableOpacity onPress={handleSubmit2}>
              <Image style={{ width: 24, height: 24 }} source={require('./src/assets/icons/settings.png')} />
            </TouchableOpacity>
          </View>

          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            ref={flatListRef} // Передача рефа
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            ListFooterComponent={<View style={{ alignItems: 'center', marginBottom: 10 }}>
              {/* <TouchableOpacity
                style={{ backgroundColor: '#F4F4F4', borderRadius: 10, minHeight: 40, justifyContent: 'center', alignItems: 'center', width: '80%' }}
              >
                <Text style={{ color: '#3E3E3E', fontSize: 14, textAlign: 'center' }}>
                  Нажмите, чтобы отправить сообщение
                </Text>
              </TouchableOpacity> */}
            </View>}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#A1A1A1"
              onChangeText={text => setMessageText(text)}
              value={messageText}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="center"
            />
            {/* <Button title="Send" onPress={handleSubmit2} /> */}
            <TouchableOpacity onPress={handleSubmit2}>
              <Image style={{ width: 30, height: 30 }} source={require('./src/assets/icons/send.png')} />
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    // paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
    flexDirection: 'row'
  },
  userMessage: {
    backgroundColor: '#67CFCF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0
  },
  otherMessage: {
    backgroundColor: '#EEEEEE',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  otherMessageText: {
    color: '#505050',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 40,
    minHeight: 56,
    // Тень для Android
    elevation: 5,
    // Тень для iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    marginRight: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 40,
    fontSize: 13,
    paddingTop: 12
  },
});
