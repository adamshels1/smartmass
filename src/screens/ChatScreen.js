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
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import i18n from '../shared/config/i18n';
import {ImagePixabay, ImageUnsplash} from '../shared/ui/ImageByDescription';
import {Message} from '../features/chat/index.ts';

import {Calendar, LocaleConfig} from 'react-native-calendars';

const {GoogleGenerativeAI} = require('@google/generative-ai');

import {Flow} from 'react-native-animated-spinkit';
import {
  clearDays,
  setCalories,
  setCart,
  setDietAction,
  setMealtimesAction,
  setMessagesAction,
  setStepAction,
  setTooltipStep,
} from '../store/userActions';
import AgendaComponent from '../components/AgendaComponent';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Инициализация GoogleGenerativeAI
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');
import {getTimeStamp, getNextMeal, getCurrentMeal} from '../utils/helpers';
import moment from 'moment/moment';
import CalendarModal from '../components/CalendarModal';
const today = moment();
import CurrentWeek from '../components/CurrentWeek';
import {formatDietDataToString, jsonParse} from '../utils/format';

import Tooltip from 'react-native-walkthrough-tooltip';
import {sortByTime} from '../utils/sort';
export default function ChatScreen({navigation}) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
  const [messageText, setMessageText] = useState('');
  // const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null); // Создание рефа
  const userData = useSelector(state => state.userData);
  const days = useSelector(state => state.userData.days);
  const tooltipStep = useSelector(state => state.userData.tooltipStep);
  const [isVisibleChangePartDiet, setIsVisibleChangePartDiet] = useState(false);
  const [changePartDietOptions, setChangePartDietOptions] = useState([]);
  // console.log('days', days);
  const day = useSelector(state =>
    state.userData?.days?.find(day =>
      moment(day.date).isSame(moment(selectedDate), 'day'),
    ),
  );

  const exampleResponseDiet = `{
  diet: [
    {
      time: 'здесь время',
      name: 'здесь название приема пищи',
      dish: 'здесь название блюда',
      dishEn: 'здесь название данного блюда переведи на en',
      dishCalories: 'здесь количество колорий этого блюда в конце ккал'
    }
  ],
  dietTotalCalories: 'сумма всех dishCalories в массиве diet должна быть ровно ${userData.calories} ',
  products: [{
    name: 'здесь название продукта',
    nameEn: 'здесь название продукта на английском',
    amount: 'здесь количество только цифра',
    units: 'Единица измерения (г, кг, мл, л, шт)',
  }]
}
`;

  useEffect(() => {
    // Получение уникального идентификатора устройства
    const getDeviceId = async () => {
      const deviceId = await DeviceInfo.getUniqueId();

      // Установка идентификатора пользователя, который может быть идентификатором устройства
      analytics().setUserId(deviceId);
    };

    getDeviceId();

    // Отправка события о просмотре домашнего экрана
    analytics().logEvent('screen_view', {screen_name: 'Home'});

    // Очистка эффекта
    return () => {};
  }, []);

  const lastDay = days?.[days?.length - 1];
  // console.log('userData', userData);
  const messages = day?.messages || [];
  // console.log('messages', messages);
  // const step = useSelector(state => state.userData.step);
  let step = 1;
  // console.log('step', step);
  if (!userData?.calories || userData?.calories === '0') {
    step = 0;
  } else if (day?.step > 1) {
    step = day?.step;
  }
  const [isBotWriting, setIsBotWriting] = useState(false);
  const isHasSettingsData =
    userData.weight && userData.height && userData.goal && userData.allergies;

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const handleDateSelect = date => {
    setSelectedDate(date);
    closeModal();
  };

  async function onCreateTriggerNotification(timestamp, title, body) {
    console.log('timestamp', timestamp);
    try {
      // const date = new Date(Date.now());
      // date.setHours(12);
      // date.setMinutes(12);

      // Create a time-based trigger
      const trigger = {
        type: TriggerType.TIMESTAMP,
        // timestamp: Date.now() + (1000 * 10), // fire at 11:10am (10 minutes before meeting)
        timestamp: timestamp - 1000 * 30, //  (30 minutes before mealtime)
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
      console.log('createTriggerNotification', res);
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

  const scheduleMealtimeNotifications = async (diet, date) => {
    try {
      // dispatch(setMealtimesAction(jsonParse(mealtimes), date));

      // console.log('mealtimes', mealtimes)
      diet.map(item => {
        console.log('item.time', item.time);

        const datetime = moment(
          moment(date).format('YYYY-MM-DD') + ' ' + item.time,
          'YYYY-MM-DD HH:mm',
        );

        console.log('datetime', datetime);

        console.log('title', item.name + ' в ' + item.time);
        console.log('desc', item.dish + ' - ' + item.dishCalories);

        onCreateTriggerNotification(
          datetime.valueOf(),
          item.name + ' в ' + item.time,
          item.dish + ' - ' + item.dishCalories,
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
    changedDiet,
    meal,
  }) => {
    try {
      // console.log(messageText, step);
      if (step === 2 && messageText === i18n.t('Change part of the diet')) {
        setIsVisibleChangePartDiet(true);
        await sleep(300);
        flatListRef.current.scrollToEnd({animated: true});
        return;
      }

      setIsBotWriting(true);

      analytics().logEvent('send_message', {message: messageText});

      // let messages =
      //   store
      //     .getState()
      //     .userData.days?.find(day => moment(day.date).isSame(today, 'day'))
      //     ?.messages || [];

      const newUserMessage = {
        role: 'user',
        parts: [{text: messageTextVisible ? messageTextVisible : messageText}],
      };

      dispatch(setMessagesAction([...messages, newUserMessage], selectedDate));

      setMessageText('');

      await sleep(100);

      flatListRef.current.scrollToEnd({animated: true});

      const deviceId = await DeviceInfo.getUniqueId();

      const context = {
        contextId: deviceId,
        weight: userData.weight,
        height: userData.height,
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
        likedDishes: userData.likedDishes,
        exampleResponseDiet,
        diet: day?.diet,
      };
      console.log('sendMessage', messageText);
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const result = await model.generateContent(
        JSON.stringify({prompt: messageText, context, language: i18n.language}),
      );
      const response = await result.response;
      let text = response.text();
      setIsBotWriting(false);

      console.log('response', text);
      analytics().logEvent('send_message', {response: text});

      let data = {};

      if (step === 1) {
        dispatch(setCalories(text));
        text = i18n.t('You need to consume {{calories}} calories per day.', {
          calories: text,
        });
      } else if (step === 2 && changedDiet) {
        console.log('changedDiet', changedDiet);
        const products = jsonParse(text);
        const dietString = formatDietDataToString(changedDiet);
        console.log('formatDietDataToString', dietString);
        dispatch(setDietAction(changedDiet, products.products, selectedDate));
        text = dietString + i18n.t('Total calories: ') + day?.calories;
        data.type = 'diet';
        data.diet = changedDiet;
        data.products = products.products;
      } else if (step === 2) {
        const diet = jsonParse(text);
        const dietString = formatDietDataToString(diet.diet);
        console.log('formatDietDataToString', dietString);
        dispatch(setDietAction(diet.diet, diet.products, selectedDate));
        text = dietString + i18n.t('Total calories: ') + diet.dietTotalCalories;
        data.type = 'diet';
        data.diet = diet.diet;
        data.products = diet.products;
      } else if (step === 3) {
        const partDietOptions = jsonParse(text);
        setIsVisibleChangePartDiet(false);
        console.log('partDietOptions.diet', partDietOptions.diet.length);
        // return;
        setChangePartDietOptions(partDietOptions.diet);
        text = i18n.t('Выберите из перечисленных вариантов');
      } else if (step === 5) {
        await scheduleMealtimeNotifications(day?.diet, selectedDate);
        text = i18n.t('Notifications successfully scheduled');
      } else if (step === 6) {
        data.type = 'recipe';
        data.meal = meal;
      }

      if (text?.length > 3 && step) {
        dispatch(setStepAction(step, selectedDate));
      }

      const newBotMessage = {role: 'model', parts: [{text}], data};
      dispatch(
        setMessagesAction(
          [...messages, newUserMessage, newBotMessage],
          selectedDate,
        ),
      );

      await sleep(100);

      flatListRef.current.scrollToEnd({animated: true});
      await sleep(2000);
      setToolTipVisible(true);
    } catch (error) {
      setIsBotWriting(false);
      console.error('Error sending message:', error);
    }
  };

  // Rendering message element
  const renderMessage = ({item}) => <Message item={item} />;

  const nextMealTime = getNextMeal(day?.diet, selectedDate);
  const currentMealTime = getCurrentMeal(day?.diet, selectedDate);

  const dietPromt = i18n.t(
    'for one day, following the example of exampleResponseDiet in pure JSON format, so that the total sum of all dishes contains {{calories}} kcal, the total number of meals per day is {{maxMealPerDay}}, and products should contain all the items that need to be purchased for the diet.',
    {
      calories: userData.calories,
      dailyMealStartTime: userData.dailyMealStartTime,
      dailyMealEndTime: userData.dailyMealEndTime,
      maxMealPerDay: userData.maxMealPerDay,
    },
  );

  const changePartDietButtons =
    day?.diet?.length && isVisibleChangePartDiet
      ? sortByTime(day.diet).map(diet => ({
          buttonText: i18n.t('Изменить {{name}} в {{time}}', {
            name: diet.name,
            time: diet.time,
          }),
          messageText:
            i18n.t(
              'Дай другие примеры до 20 разных блюд для замены {{name}}, в формате в JSON: ',
              {name: diet.name},
            ) +
            JSON.stringify({
              diet: [
                {
                  time: `Time должно быть=${diet.time}`,
                  name: `Name должно быть=${diet.name}`,
                  dish: 'здесь название блюда',
                  dishEn: 'здесь название данного блюда переведи на en',
                  dishCalories: `Калории должны быть=${diet.dishCalories}`,
                },
              ],
            }),
          messageTextVisible: i18n.t('Change to another {{name}}', {
            name: diet.name,
          }),
          nextStep: 3,
        }))
      : [];

  const changePartDietResults = changePartDietOptions.length
    ? changePartDietOptions.map(diet => {
        const changedDiet = day?.diet?.map(item => {
          if (item.time === diet.time) {
            return {
              ...item,
              dish: diet.dish,
              dishEn: diet.dishEn,
              dishCalories: diet.dishCalories,
            };
          }
          return item;
        });

        return {
          buttonText: i18n.t('{{dish}}\n{{time}}, {{dishCalories}}', {
            dish: diet.dish,
            time: diet.time,
            dishCalories: diet.dishCalories,
          }),
          changedDiet: changedDiet,
          newMeal: diet,
          messageText:
            'Какие продукты необходимы для этого рациона: ' +
            JSON.stringify(changedDiet?.map(item => item.dish)) +
            ' в формате ' +
            JSON.stringify({
              products: [
                {
                  name: 'здесь название продукта',
                  amount: 'здесь количество только цифра',
                  units: 'Единица измерения (г, кг, мл, л, шт)',
                },
              ],
            }),
          messageTextVisible: i18n.t(
            'Replace the meal at {{time}} with {{dish}}',
            {
              time: diet.time,
              dish: diet.dish,
            },
          ),
          nextStep: 2,
        };
      })
    : [];

  const messageButtons = [
    {
      step: 0,
      buttons: [
        {
          buttonText: i18n.t('How many calories are needed per day?'),
          messageText: i18n.t(
            `Hi! Please send the exact number of necessary calories as a whole number for the goal: ${userData.goal}, for weight: ${userData.weight} kg and height: ${userData.height} cm.`,
          ),
          messageTextVisible: i18n.t(
            'Hello! Send the exact required number of calories',
          ),
          nextStep: 1,
        },
      ],
    },
    {
      step: 1,
      buttons: [
        {
          buttonText: i18n.t('Get a diet for this day'),
          messageText: i18n.t('Write a diet') + dietPromt,
          messageTextVisible: i18n.t(
            'Write a diet for 1 day with time and what products need to be bought',
          ),
          nextStep: 2,
        },
      ],
    },
    {
      step: 2,
      buttons: [
        {
          buttonText: i18n.t('Alright, what products do I need to buy?'),
          messageText:
            i18n.t('Make a shopping list for products:') +
            JSON.stringify(day?.products) +
            '?',
          messageTextVisible: i18n.t('What products to buy'),
          nextStep: 4,
        },
        {
          buttonText: i18n.t('Get another diet'),
          messageText: i18n.t('Write another diet ') + dietPromt,
          messageTextVisible: i18n.t('Get another diet'),
          nextStep: 2,
        },
        {
          buttonText: i18n.t('Change part of the diet'),
          messageText: i18n.t('Change part of the diet'),
          messageTextVisible: i18n.t('Change part of the diet'),
          nextStep: 2,
        },
        ...changePartDietButtons,
      ],
    },
    {
      step: 3,
      buttons: [...changePartDietResults],
    },
    {
      step: 4,
      buttons: [
        {
          buttonText: i18n.t(
            "Products purchased. Let's set up notifications for cooking time.",
          ),
          messageText:
            i18n.t(
              'Return the names of the time and write down the meal time from the diet',
            ) +
            JSON.stringify(day?.diet) +
            i18n.t(' in JSON format: [{time: null, name: null }]'),
          messageTextVisible: i18n.t(
            "Products purchased, let's set up notifications for cooking time",
          ),
          nextStep: 5,
        },
      ],
    },
    {
      step: 5,
      buttons: [
        {
          buttonText: i18n.t(
            'Current meal: {{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: currentMealTime?.name,
              mealTime: currentMealTime?.time,
            },
          ),
          messageText:
            i18n.t('Give the recipe:') +
            `${currentMealTime?.dish} - ${currentMealTime?.dishCalories} ` +
            i18n.t('at') +
            `${currentMealTime?.time}`,
          messageTextVisible: i18n.t(
            '{{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: currentMealTime?.name,
              mealTime: currentMealTime?.time,
            },
          ),
          meal: currentMealTime,
          nextStep: 6,
        },
        {
          buttonText: i18n.t(
            'Next meal: {{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: nextMealTime?.name,
              mealTime: nextMealTime?.time,
            },
          ),
          messageText:
            i18n.t('Give the recipe:') +
            `${nextMealTime?.dish} - ${nextMealTime?.dishCalories} ` +
            i18n.t('at') +
            `${nextMealTime?.time}`,
          messageTextVisible: i18n.t(
            '{{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: nextMealTime?.name,
              mealTime: nextMealTime?.time,
            },
          ),
          meal: nextMealTime,
          nextStep: 6,
        },
        {
          buttonText: i18n.t('Get another diet'),
          messageText: i18n.t('Write another diet') + dietPromt,
          messageTextVisible: i18n.t('Get another diet'),
          nextStep: 2,
        },
      ],
    },
    {
      step: 6,
      buttons: [
        {
          buttonText: i18n.t(
            'Current meal: {{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: currentMealTime?.name,
              mealTime: currentMealTime?.time,
            },
          ),
          messageText:
            i18n.t('Give the recipe:') +
            `${currentMealTime?.dish} - ${currentMealTime?.dishCalories} ` +
            i18n.t('at') +
            `${currentMealTime?.time}`,
          messageTextVisible: i18n.t(
            '{{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: currentMealTime?.name,
              mealTime: currentMealTime?.time,
            },
          ),
          meal: currentMealTime,
          nextStep: 6,
        },
        {
          buttonText: i18n.t(
            'Next meal: {{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: nextMealTime?.name,
              mealTime: nextMealTime?.time,
            },
          ),
          messageText:
            i18n.t('Give the recipe:') +
            nextMealTime?.dish +
            i18n.t(' - ') +
            nextMealTime?.dishCalories +
            i18n.t('at') +
            nextMealTime?.time,
          messageTextVisible: i18n.t(
            '{{mealName}} at {{mealTime}}, Get the recipe',
            {
              mealName: nextMealTime?.name,
              mealTime: nextMealTime?.time,
            },
          ),
          meal: nextMealTime,
          nextStep: 6,
        },
        {
          buttonText: i18n.t('Get another diet'),
          messageText: i18n.t('Write another diet') + dietPromt,
          messageTextVisible: i18n.t('Get another diet'),
          nextStep: 2,
        },
      ],
    },
  ];

  const [toolTipVisible, setToolTipVisible] = useState(true);

  const renderMessageButtons = () => {
    if (isBotWriting) {
      return null;
    }
    // console.log('step ---->', step);
    return messageButtons
      ?.find(i => i.step === step)
      ?.buttons.map((i, key) => {
        // console.log('step', step, tooltipStep);
        if (step === 0 || step === 1) {
          return (
            <Tooltip
              key={key}
              animated={true}
              arrowSize={{width: 16, height: 8}}
              backgroundColor="rgba(0,0,0,0.5)"
              isVisible={
                tooltipStep === 'showGetCaloriesButton' ||
                tooltipStep === 'showGetRationButton'
              }
              content={
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: '#505050',
                      fontWeight: '300',
                    }}>
                    {i18n.t('Click here')}
                  </Text>
                </View>
              }
              placement="top"
              onClose={() => {
                if (tooltipStep === 'showGetCaloriesButton') {
                  dispatch(setTooltipStep('showGetRationButton'));
                } else if (tooltipStep === 'showGetRationButton') {
                  dispatch(setTooltipStep('showNexDayButton'));
                }
              }}>
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
                    borderWidth: 1,
                    borderColor: '#67CFCF',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    maxWidth: '86%',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: '#505050',
                      fontWeight: '300',
                    }}>
                    {i.buttonText}
                  </Text>
                  <Image
                    style={{width: 15, height: 15, top: 1.5, marginLeft: 10}}
                    source={require('../assets/icons/send.png')}
                  />
                </TouchableOpacity>
              </View>
            </Tooltip>
          );
        }
        return (
          <View key={key} style={{alignItems: 'center', marginBottom: 5}}>
            <TouchableOpacity
              onPress={() =>
                handleSendMessage({
                  messageText: i.messageText,
                  messageTextVisible: i.messageTextVisible,
                  changedDiet: i.changedDiet,
                  step: i.nextStep,
                  meal: i.meal,
                })
              }
              style={{
                backgroundColor: '#F4F4F4',
                borderRadius: 15,
                minHeight: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#67CFCF',
                paddingVertical: 5,
                paddingHorizontal: 5,
                // maxWidth: '90%',
                flexDirection: 'row',
              }}>
              {i.newMeal && (
                <ImagePixabay
                  description={i.newMeal.dishEn}
                  style={{borderRadius: 50, marginRight: 7}}
                  imageStyle={{borderRadius: 50}}
                  size="medium"
                />
              )}

              <Text
                style={{
                  color: '#3E3E3E',
                  fontSize: 13,
                  fontWeight: '400',
                  width: 200,
                  paddingHorizontal: 10,
                }}>
                {i.buttonText}
              </Text>
              <Image
                style={{width: 15, height: 15, top: 1.5, marginLeft: 10}}
                source={require('../assets/icons/send.png')}
              />
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
              ? i18n.t('Goal for {{date}}: {{calories}}kcal', {
                  date: moment(selectedDate).format('DD.MM.YYYY'),
                  calories: userData.calories,
                })
              : i18n.t('Nutrition consultant GPT')
          }
          showSettingsIcon={true}
        />
        <CurrentWeek
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          toolTipVisible={toolTipVisible}
          setToolTipVisible={setToolTipVisible}
        />

        {__DEV__ && (
          <View>
            <Button
              title={i18n.t('Clear all')}
              onPress={() => {
                dispatch(setMessagesAction([]));
                dispatch(setStepAction(0, selectedDate));
                dispatch(clearDays());
                dispatch(setCart([]));
                dispatch(setTooltipStep('showGetCaloriesButton'));
                dispatch(setCalories(null));
                setIsVisibleChangePartDiet(false);
              }}
            />
          </View>
        )}
        {/*{__DEV__ && (*/}
        {/*  <View>*/}
        {/*    <Button*/}
        {/*      title="Schedule Notification"*/}
        {/*      onPress={() => onCreateTriggerNotification('aaa', 'bbbb')}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*)}*/}

        <View style={styles.container}>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            ref={flatListRef}
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
                <View>
                  <TouchableOpacity
                    style={{marginBottom: 0, marginTop: 5}}
                    onPress={() => navigation.navigate('SourcesScreen')}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 13,
                        color: 'gray',
                      }}>
                      {i18n.t('Information Sources')}
                    </Text>
                  </TouchableOpacity>
                  {/*<ImageUnsplash*/}
                  {/*  description={'mealtime Beef stew with sweet potato mash'}*/}
                  {/*/>*/}
                  {/*<ImagePixabay*/}
                  {/*  description={'mealtime Beef stew with sweet potato mash'}*/}
                  {/*/>*/}
                </View>
              </View>
            }
          />

          {/*<View style={styles.inputContainer}>*/}
          {/*  <TextInput*/}
          {/*    style={styles.input}*/}
          {/*    placeholder={i18n.t('Type a message...')}*/}
          {/*    placeholderTextColor="#A1A1A1"*/}
          {/*    onChangeText={text => setMessageText(text)}*/}
          {/*    value={messageText}*/}
          {/*    multiline={true}*/}
          {/*    numberOfLines={4}*/}
          {/*    textAlignVertical="center"*/}
          {/*  />*/}
          {/*  <TouchableOpacity*/}
          {/*    onPress={() =>*/}
          {/*      handleSendMessage({*/}
          {/*        messageText,*/}
          {/*      })*/}
          {/*    }*/}
          {/*    disabled={!disabledSendButton}*/}
          {/*    style={{opacity: disabledSendButton ? 1 : 0.5}}>*/}
          {/*    <Image*/}
          {/*      style={{width: 30, height: 30}}*/}
          {/*      source={require('../assets/icons/send.png')}*/}
          {/*    />*/}
          {/*  </TouchableOpacity>*/}
          {/*</View>*/}
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
