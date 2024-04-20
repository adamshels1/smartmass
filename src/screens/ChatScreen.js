import { Provider, useSelector, useDispatch } from 'react-redux'
import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import Header from '../components/Header';
import LottieView from 'lottie-react-native';

const { GoogleGenerativeAI } = require('@google/generative-ai');
import Markdown from 'react-native-markdown-display';

export const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

import { Flow } from 'react-native-animated-spinkit'
import { setDietAction } from '../store/userActions';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Инициализация GoogleGenerativeAI
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');

export default function ChatScreen({ navigation }) {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null); // Создание рефа
  const userData = useSelector(state => state.userData)
  const [isBotWriting, setIsBotWriting] = useState(false);
  const [messageOptionStep, setMessageOptionStep] = useState(3)


  const isHasSettingsData = userData.weight && userData.height && userData.goal && userData.allergies;

  useEffect(() => {
    if (!isHasSettingsData) {
      navigation.navigate('SettingsScreen')
    }
  }, [isHasSettingsData])


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


  const handleSubmit2 = async (messageText, messageOptionStep) => {
    setIsBotWriting(true)
    console.log('messageOptionStep', messageOptionStep)
    setMessageOptionStep(messageOptionStep)
    const context = {
      weight: userData.weight, // Assuming weight is a number
      height: userData.height, // Assuming height is a number
      goal: [userData.goal, 'Разпозновать пищевую ценность продуктов питания'],
      description: ['давай короткие ответы на рецепты'],
      allergies: userData.allergies,
      likedDishes: userData.likedDishes, // Add an empty array for liked dishes
      exampleResponseDiet: `**Рацион на 1 день:**

**8:00 Завтрак**
* Овсянка с молоком (50 г овсянки, 100 мл молока)

**10:00 Перекус**
* Банан (100 г)

**12:00 Обед**
* Куриная грудка с бурым рисом и овощами (100 г курицы, 100 г риса, 100 г овощей)

**15:00 Перекус**
* Яблоко (100 г)

**17:00 Ужин**
* Рыба с картофелем и овощами (100 г рыбы, 100 г картофеля, 100 г овощей)

**Список продуктов для покупки:**

* Овсянка: 50 г
* Молоко: 100 мл
* Банан: 100 г
* Куриная грудка: 100 г
* Бурый рис: 100 г
* Овощи: 100 г
* Яблоко: 100 г
* Рыба: 100 г
* Картофель: 100 г
`,
      // diet: userData.diet
      diet: `**Рацион на 1 день:**

      **Время | Продукт**
      ---|---|
      **8:00 Завтрак** | Овсянка (50 г) с молоком (100 мл)
      **11:00 Перекус** | Банан (100 г)
      **13:00 Обед** | Куриная грудка (150 г) с бурым рисом (100 г) и овощами (150 г)
      **16:00 Перекус** | Яблоко (100 г)
      **19:00 Ужин** | Рыба (150 г) с картофелем (150 г) и овощами (150 г)
      
      **Список продуктов для покупки:**
      
      * Овсянка: 50 г
      * Молоко: 100 мл
      * Банан: 100 г
      * Куриная грудка: 150 г
      * Бурый рис: 100 г
      * Овощи (для обеда и ужина): 300 г
      * Яблоко: 100 г
      * Рыба: 150 г
      * Картофель: 150 г`
    };

    // For text-only input, use the gemini-pro model
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

    const result = await model.generateContent(JSON.stringify({ prompt: messageText, context }));
    const response = await result.response;
    const text = response.text();
    console.log(text);
    setIsBotWriting(false);

    if (messageOptionStep === 1) {
      dispatch(setDietAction(text))
    }

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
        {item?.parts[0]?.text?.replace(/[*]/g, "•")}
      </Markdown>

    </View>
  );

  const messageButtons = [
    {
      step: 1,
      buttons: [
        {
          buttonText: 'Получить рацион на 1 день',
          messageText: 'Напиши рацион на 1 день со временем и какие продукты нужно купить по сколько грамм для этого рациона, до 15 продуктов',
          nextStep: 2
        }
      ]
    },
    {
      step: 2,
      buttons: [
        {
          buttonText: 'Хорошо, какие закупить продукты?',
          messageText: 'Какие закупить продукты на рацион и по сколько грамм из контекста?',
          nextStep: 3
        },
        {
          buttonText: 'Получить другой рацион',
          messageText: 'Напиши рацион другой на 1 день со временем и какие продукты нужно купить по сколько грамм для этого рациона, до 15 продуктов',
          nextSte: 2
        }
      ]
    },
    {
      step: 3,
      buttons: [
        {
          buttonText: 'Продукты куплены, давай поставим уведомления во времени приготовления',
          messageText: 'Верни названия времени и время приема пиши из рациона контекста в формате json: [{time: null, name: null }]',
          nextStep: 3
        }
      ]
    }
  ]

  const renderMessageButtons = () => {
    if (isBotWriting) return null
    return messageButtons?.find(i => i.step === messageOptionStep)?.buttons.map(i => {
      return (
        <View style={{ alignItems: 'center', marginBottom: 5 }}>
          <TouchableOpacity
            onPress={() => handleSubmit2(i.messageText, i.nextStep)}
            style={{ backgroundColor: '#F4F4F4', borderRadius: 15, minHeight: 40, justifyContent: 'center', alignItems: 'center', width: '80%', borderWidth: 1, borderColor: '#67CFCF', paddingVertical: 5 }}
          >
            <Text style={{ color: '#3E3E3E', fontSize: 14 }}>
              {i.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>

        <Header
          showBack={false}
          navigation={navigation}
          title='Nutrition consultant GPT'
          showSettingsIcon={true}
        />

        <View style={styles.container}>


          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            ref={flatListRef} // Передача рефа
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            ListFooterComponent={<View style={{ marginBottom: 10 }}>
              {isBotWriting && (
                <Flow style={{ marginLeft: 15 }} size={48} color="#A1A1A1" />
              )}

              {/* {isBotWriting && (
                <Image style={{ width: 80, height: 50, marginBottom: 0 }} resizeMode='contain' source={require('../assets/animations/writing.gif')} />
              )} */}

              {renderMessageButtons()}

            </View>}
          />




        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
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
    borderBottomLeftRadius: 0,
    maxWidth: '99%',
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
    paddingHorizontal: 15,
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
    paddingTop: 12,
    color: '#3E423A'
  },
});
