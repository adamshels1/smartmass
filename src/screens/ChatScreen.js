import {useSelector, useDispatch, useStore} from 'react-redux';
import React, {useState, useRef, useEffect} from 'react';
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
import notifee, {TriggerType} from '@notifee/react-native';
import Header from '../components/Header';

const {GoogleGenerativeAI} = require('@google/generative-ai');
import Markdown from 'react-native-markdown-display';

import {Flow} from 'react-native-animated-spinkit';
import {
  setCalories,
  setDietAction,
  setMealtimesAction,
  setMessagesAction,
  setStepAction,
} from '../store/userActions';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Инициализация GoogleGenerativeAI
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');
import {getTimeStamp, getNextMeal} from '../utils/helpers';

export default function ChatScreen({navigation}) {
  const dispatch = useDispatch();
  const store = useStore();
  const [messageText, setMessageText] = useState('');
  // const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null); // Создание рефа
  const userData = useSelector(state => state.userData);
  const messages = useSelector(state => state.userData.messages);
  console.log('messages', messages);
  const step = useSelector(state => state.userData.step);
  const [isBotWriting, setIsBotWriting] = useState(false);
  const isHasSettingsData =
    userData.weight && userData.height && userData.goal && userData.allergies;

  async function onCreateTriggerNotification(time, title, body) {
    try {
      const date = new Date(Date.now());
      date.setHours(12);
      date.setMinutes(12);

      // Create a time-based trigger
      const trigger = {
        type: TriggerType.TIMESTAMP,
        // timestamp: Date.now() + (1000 * 10), // fire at 11:10am (10 minutes before meeting)
        timestamp: getTimeStamp(time), // fire at 11:10am (10 minutes before meeting)
      };

      await notifee.createChannel({
        id: 'mealtime',
        name: 'Default Channel',
        sound: 'doorbell',
      });

      // Create a trigger notification
      const res = await notifee.createTriggerNotification(
        {
          title,
          body,
          android: {
            channelId: 'mealtime',
            sound: 'doorbell',
            pressAction: {
              id: 'default', // Уникальный идентификатор действия
              // launchActivity: 'com.example.MainActivity', // Замените на активность вашего приложения, которая должна быть запущена при нажатии
            },
          },
        },
        trigger,
      );
      console.log('res', res);
    } catch (e) {
      console.log('e', e);
    }
  }

  // async function onDisplayNotification() {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission();
  //
  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'mealtime',
  //     name: 'Default Channel',
  //     sound: 'doorbell',
  //   });
  //
  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //       smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // }

  const scheduleMealtimeNotifications = async mealtimes => {
    try {
      dispatch(setMealtimesAction(JSON.parse(mealtimes)));

      // console.log('mealtimes', mealtimes)
      JSON.parse(mealtimes).map(item => {
        onCreateTriggerNotification(
          item.time,
          item.name + ' в ' + item.time,
          'Настало время приема пищи',
        );
      });

      // JSON.parse('[{"time": "14:27", "name": "Завтрак"}, {"time": "14:28", "name": "Перекус"}, {"time": "14:29", "name": "Обед"}, {"time": "16:00", "name": "Перекус"}, {"time": "19:00", "name": "Ужин"}]').map(item => {
      //   // console.log('item', item)
      //   onCreateTriggerNotification(item.time, item.name, 'Настало время приема пищи')
      // })
      // Request permissions (required for iOS)
      await notifee.requestPermission();
      //create channel for android
      await notifee.createChannel({
        id: 'mealtime',
        name: 'Default Channel',
        sound: 'doorbell',
      });
    } catch (e) {
      console.log('e', e);
    }
  };

  useEffect(() => {
    if (!isHasSettingsData) {
      navigation.navigate('SettingsScreen');
    }
  }, [isHasSettingsData, navigation]);

  useEffect(() => {
    const backgroundEventHandler = async ({type, detail}) => {
      // Обработка событий фоновой работы здесь
      console.log('Background event:', type, detail);

      // **Исправление:** Не рекомендуется использовать `notifee.displayNotification`
      //   в обработчике фонового события. Это может привести к проблемам
      //   с отображением уведомления.

      // **Рекомендуется:** Отложить отображение уведомления до того,
      //   как приложение вернется на передний план.

      await Notifications.displayNotification({
        title: detail.notification.title,
        body: detail.notification.body,
        data: detail.notification.data,
      });

      // Пример обработки события
      // if (type === 'notificationPress') {
      //   // Handle notification press event here
      //   console.log('Notification pressed!');

      //   // **Отложить отображение уведомления:**
      //   await Notifications.displayNotification({
      //     title: detail.notification.title,
      //     body: detail.notification.body,
      //     data: detail.notification.data,
      //   });
      // }
    };

    // Установка обработчика событий фоновой работы
    notifee.onBackgroundEvent(backgroundEventHandler);

    // Очистка обработчика при размонтировании компонента
    return () => {
      // notifee?.offBackgroundEvent(backgroundEventHandler);
    };
  }, []);

  const handleSendMessage = async ({
    messageText,
    messageTextVisible,
    step = null,
  }) => {
    try {
      setIsBotWriting(true);

      const context = {
        weight: userData.weight, // Assuming weight is a number
        height: userData.height, // Assuming height is a number
        dailyMealStartTime: userData.dailyMealStartTime,
        dailyMealEndTime: userData.dailyMealEndTime,
        goal: [
          userData.goal,
          'Разпозновать пищевую ценность продуктов питания',
        ],
        maxMealPerDay: userData.maxMealPerDay,
        description: [
          'давай короткие ответы на рецепты',
          'если набор массы то давай полезные калорийные продукты такие как авакадо, орехи, какао, сливки',
          'если набор массы то можно использовать протеиновые порошки',
        ],
        allergies: userData.allergies,
        preferredProducts: userData.preferredProducts,
        likedDishes: userData.likedDishes, // Add an empty array for liked dishes
        exampleResponseDiet: `**Рацион на 1 день:**

**Здесь время**
* Здесь блюдо, количество ккал

Итого ккал

**Список продуктов для покупки:**
`,
        diet: userData.diet,
        // diet: `**Рацион на 1 день:**

        // **Время | Продукт**
        // ---|---|
        // **8:00 Завтрак** | Овсянка (50 г) с молоком (100 мл)
        // **11:00 Перекус** | Банан (100 г)
        // **13:00 Обед** | Куриная грудка (150 г) с бурым рисом (100 г) и овощами (150 г)
        // **16:00 Перекус** | Яблоко (100 г)
        // **19:00 Ужин** | Рыба (150 г) с картофелем (150 г) и овощами (150 г)

        // **Список продуктов для покупки:**

        // * Овсянка: 50 г
        // * Молоко: 100 мл
        // * Банан: 100 г
        // * Куриная грудка: 150 г
        // * Бурый рис: 100 г
        // * Овощи (для обеда и ужина): 300 г
        // * Яблоко: 100 г
        // * Рыба: 150 г
        // * Картофель: 150 г`
      };

      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});

      // Добавляем сообщение пользователя в список сообщений
      // setMessages(prevMessages => [
      //   ...prevMessages,
      //   { role: 'user', parts: [{ text: messageText }] },
      // ]);
      dispatch(
        setMessagesAction([
          ...store.getState().userData.messages,
          {
            role: 'user',
            parts: [
              {text: messageTextVisible ? messageTextVisible : messageText},
            ],
          },
        ]),
      );

      // Очистка поля ввода после отправки
      setMessageText('');

      await sleep(100);

      flatListRef.current.scrollToEnd({animated: true});

      const result = await model.generateContent(
        JSON.stringify({prompt: messageText, context}),
      );
      const response = await result.response;
      let text = response.text();
      console.log('messageSend', messageText);
      console.log('response', text);
      console.log('/n');
      setIsBotWriting(false);
      console.log('step', step);
      if (step === 1) {
        dispatch(setCalories(text));
        text = `Вам необходимо набрать ${text} калорий за один день.`;
      } else if (step === 2) {
        dispatch(setDietAction(text));
      } else if (step === 4) {
        scheduleMealtimeNotifications(text);
        text = 'Нотификации успешно запланированы';
      }

      if (text?.length > 3 && step) {
        dispatch(setStepAction(step));
      }

      // Обновляем соответствующее сообщение с ответом модели
      // setMessages(prevMessages => [
      //   ...prevMessages,
      //   { role: 'model', parts: [{ text }] },
      // ]);
      dispatch(
        setMessagesAction([
          ...store.getState().userData.messages,
          {role: 'model', parts: [{text}]},
        ]),
      );

      await sleep(100);

      // Прокрутка списка вниз
      flatListRef.current.scrollToEnd({animated: true});
    } catch (e) {
      setIsBotWriting(false);
      console.error('error send message:', e);
    }
  };

  // Рендеринг элемента сообщения
  const renderMessage = ({item}) => (
    <View
      style={[
        styles.message,
        item.role === 'user' ? styles.userMessage : styles.otherMessage,
      ]}>
      <Markdown
        style={{
          body:
            item.role === 'user'
              ? styles.userMessageText
              : styles.otherMessageText,
        }}>
        {item?.parts[0]?.text?.replace(/[*]/g, '•')}
      </Markdown>
    </View>
  );

  const nextMealTime = getNextMeal(userData.mealtimes);

  const messageButtons = [
    {
      step: 0,
      buttons: [
        {
          buttonText: 'Какое количество калорий необходимо в день',
          messageText:
            'Привет! Отправь точное необходимое количество калорий целой цифрой чтобы ' +
            userData.goal,
          messageTextVisible:
            'Привет! Отправь точное необходимое количество калорий',
          nextStep: 1,
        },
      ],
    },
    {
      step: 1,
      buttons: [
        {
          buttonText: 'Получить рацион на 1 день',
          messageText: `Напиши рацион на 1 день со временем и какие продукты нужно купить по сколько грамм для этого рациона, до 15 продуктов, и напиши каларийность по примеру exampleResponseDiet, что бы в рационе обязательно было ${userData.calories}ккал, перый прием пищи в ${userData.dailyMealStartTime}, последний прием пищи в ${userData.dailyMealEndTime}, общее количество приемов пищи ${userData.maxMealPerDay}.`,
          messageTextVisible:
            'Напиши рацион на 1 день со временем и какие продукты нужно купить',
          nextStep: 2,
        },
      ],
    },
    {
      step: 2,
      buttons: [
        {
          buttonText: 'Хорошо, какие продукты нужно закупить?',
          messageText:
            'Какие продукты закупить  на рацион и по сколько грамм из контекста diet?',
          messageTextVisible: 'Какие продукты закупить',
          nextStep: 3,
        },
        {
          buttonText: 'Получить другой рацион',
          messageText: `Напиши другой рацион на 1 день со временем и какие продукты нужно купить по сколько грамм для этого рациона, до 15 продуктов, и напиши каларийность по примеру exampleResponseDiet, что бы в рационе обязательно было ${userData.calories}ккал`,
          messageTextVisible: 'Получить другой рацион',
          nextStep: 2,
        },
      ],
    },
    {
      step: 3,
      buttons: [
        {
          buttonText:
            'Продукты куплены, давай поставим уведомления во времени приготовления',
          messageText:
            'Верни названия времени и время приема пиши из рациона контекста diet в формате чистый json: [{time: null, name: null }]',
          messageTextVisible:
            'Продукты куплены, давай поставим уведомления во времени приготовления',
          nextStep: 4,
        },
      ],
    },
    {
      step: 4,
      buttons: [
        {
          buttonText:
            'Следущий прием пищи: ' +
            nextMealTime?.name +
            ' в ' +
            nextMealTime?.time +
            ', Получить рецепт',
          messageText:
            'Дай из контеста diet рецепт, и как приготовить: ' +
            nextMealTime?.name +
            ' в ' +
            nextMealTime?.time,
          messageTextVisible:
            nextMealTime?.name +
            ' в ' +
            nextMealTime?.time +
            ', Получить рецепт',
          nextStep: 5,
        },
        {
          buttonText: 'Получить другой рацион',
          messageText: `Напиши другой рацион на 1 день со временем и какие продукты нужно купить по сколько грамм для этого рациона, до 15 продуктов, и напиши каларийность по примеру exampleResponseDiet, что бы в рационе обязательно было ${userData.calories}ккал`,
          nextStep: 2,
        },
      ],
    },
  ];

  const renderMessageButtons = () => {
    if (isBotWriting) {
      return null;
    }
    return messageButtons
      ?.find(i => i.step === step)
      ?.buttons.map(i => {
        return (
          <View style={{alignItems: 'center', marginBottom: 5}}>
            <TouchableOpacity
              onPress={() =>
                handleSendMessage({
                  messageText: i.messageText,
                  messageTextVisible: i.messageTextVisible,
                  step: i.nextStep,
                })
              }
              style={{
                backgroundColor: '#F4F4F4',
                borderRadius: 15,
                minHeight: 40,
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',
                borderWidth: 1,
                borderColor: '#67CFCF',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}>
              <Text style={{color: '#3E3E3E', fontSize: 14}}>
                {i.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });
  };

  const disabledSendButton = messageText && !isBotWriting;

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <Header
          showBack={false}
          navigation={navigation}
          title={
            userData.calories
              ? `Цель на сегодня: ${userData.calories}ккал`
              : 'Nutrition consultant GPT'
          }
          showSettingsIcon={true}
        />

        {/* <View>
          <Button title="Display Notification" onPress={() => onDisplayNotification()} />
        </View> */}

        <View>
          <Button
            title="Clear all"
            onPress={() => {
              dispatch(setMessagesAction([]));
              dispatch(setStepAction(0));
            }}
          />
        </View>

        <View>
          <Button
            title="Schedule Notification"
            onPress={() => onCreateTriggerNotification('aaa', 'bbbb')}
          />
        </View>

        <View style={styles.container}>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            ref={flatListRef} // Передача рефа
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
            ListFooterComponent={
              <View style={{marginBottom: 10}}>
                {isBotWriting && (
                  <Flow style={{marginLeft: 15}} size={48} color="#A1A1A1" />
                )}

                {/* {isBotWriting && (
                <Image style={{ width: 80, height: 50, marginBottom: 0 }} resizeMode='contain' source={require('../assets/animations/writing.gif')} />
              )} */}

                {renderMessageButtons()}
              </View>
            }
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
            <TouchableOpacity
              onPress={() =>
                handleSendMessage({
                  messageText,
                })
              }
              disabled={!disabledSendButton}
              style={{opacity: disabledSendButton ? 1 : 0.5}}>
              <Image
                style={{width: 30, height: 30}}
                source={require('../assets/icons/send.png')}
              />
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
    backgroundColor: '#fff',
  },
  message: {
    // paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
    flexDirection: 'row',
  },
  userMessage: {
    backgroundColor: '#67CFCF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#EEEEEE',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
    maxWidth: '85%',
    minWidth: '50%',
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
    color: '#3E423A',
  },
});
