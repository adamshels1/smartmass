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

import {Calendar, LocaleConfig} from 'react-native-calendars';

const {GoogleGenerativeAI} = require('@google/generative-ai');
import Markdown from 'react-native-markdown-display';

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
import {getTimeStamp, getNextMeal} from '../utils/helpers';
import moment from 'moment/moment';
import CalendarModal from '../components/CalendarModal';
const today = moment();
import CurrentWeek from '../components/CurrentWeek';
import {formatDietDataToString, jsonParse} from '../utils/format';

import Tooltip from 'react-native-walkthrough-tooltip';
export default function ChatScreen({navigation}) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
  const [messageText, setMessageText] = useState('');
  // const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null); // Создание рефа
  const userData = useSelector(state => state.userData);
  const days = useSelector(state => state.userData.days);
  const tooltipStep = useSelector(state => state.userData.tooltipStep);
  // console.log('days', days);
  const day = useSelector(state =>
    state.userData?.days?.find(day =>
      moment(day.date).isSame(moment(selectedDate), 'day'),
    ),
  );

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
  }) => {
    try {
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

      const context = {
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
        exampleResponseDiet: `{
  diet: [
    {
      time: 'здесь время',
      name: 'здесь название приема пищи',
      dish: 'здесь название блюда',
      dishEn: 'здесь название данного блюда переведи на en',
      dishCalories: 'здесь количество колорий этого блюда в конце ккал'
    }
  ],
  dietTotalCalories: 'здесь общее количество калорий в рационе',
  products: [{
    name: 'здесь название продукта',
    amount: 'здесь количество только цифра',
    units: 'Единица измерения (г, кг, мл, л, шт)',
  }]
}
`,
        diet: day?.diet,
      };
      console.log('sendMessage', messageText);
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const result = await model.generateContent(
        JSON.stringify({prompt: messageText, context}),
      );
      const response = await result.response;
      let text = response.text();
      setIsBotWriting(false);

      console.log('response', text);
      analytics().logEvent('send_message', {response: text});

      if (step === 1) {
        dispatch(setCalories(text));
        text = `Вам необходимо набрать ${text} калорий за один день.`;
      } else if (step === 2) {
        const diet = jsonParse(text);
        const dietString = formatDietDataToString(diet.diet);
        console.log('formatDietDataToString', dietString);
        dispatch(setDietAction(diet.diet, diet.products, selectedDate));
        text = dietString + 'Итого каллорий: ' + diet.dietTotalCalories;
      } else if (step === 4) {
        await scheduleMealtimeNotifications(day?.diet, selectedDate);
        text = 'Нотификации успешно запланированы';
      }

      if (text?.length > 3 && step) {
        dispatch(setStepAction(step, selectedDate));
      }

      const newBotMessage = {role: 'model', parts: [{text}]};
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
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  // Рендеринг элемента сообщения
  const renderMessage = ({item}) => (
    // <View
    //   style={[
    //     styles.message,
    //     item.role === 'user' ? styles.userMessage : styles.otherMessage,
    //   ]}>
    //   <Markdown
    //     style={{
    //       body:
    //         item.role === 'user'
    //           ? styles.userMessageText
    //           : styles.otherMessageText,
    //     }}>
    //     {item?.parts[0]?.text?.replace(/[*]/g, '•')}
    //   </Markdown>
    // </View>
    <View
      style={[
        styles.message,
        item.role === 'user' ? styles.userMessage : styles.otherMessage,
      ]}>
      {/*<View>*/}
      {/*  <Image*/}
      {/*    style={{*/}
      {/*      width: '100%',*/}
      {/*      height: 100,*/}
      {/*      marginBottom: 10,*/}
      {/*      borderRadius: 10,*/}
      {/*    }}*/}
      {/*    source={{*/}
      {/*      uri: 'https://images.unsplash.com/photo-1515711125864-2a69ecb3f2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MDU0NTd8MHwxfHNlYXJjaHwxfHxFZ2dzJTIwd2l0aCUyME9hdG1lYWx8ZW58MHx8fHwxNzE1NDU4MjE5fDA&ixlib=rb-4.0.3&q=80&w=400',*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</View>*/}
      <Text
        style={
          item.role === 'user'
            ? styles.userMessageText
            : styles.otherMessageText
        }>
        {item?.parts[0]?.text?.replace(/[*]/g, '•')}
      </Text>
    </View>
  );

  const nextMealTime = getNextMeal(day?.diet, selectedDate);

  const dietPromt = `на 1 день со временем и какие продукты нужно купить по сколько грамм для этого рациона, до 15 продуктов, и напиши каларийность по примеру exampleResponseDiet в чистом формате JSON, что бы в рационе обязательно было ${userData.calories}ккал, перый прием пищи в ${userData.dailyMealStartTime}, последний прием пищи в ${userData.dailyMealEndTime} должен быть перекус, общее количество приемов пищи ${userData.maxMealPerDay}`;

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
          buttonText: 'Получить рацион на этот день',
          messageText: `Напиши рацион ${dietPromt}`,
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
          messageText: `Сделай продукты для закупки списком: ${JSON.stringify(
            day?.products,
          )}?`,
          messageTextVisible: 'Какие продукты закупить',
          nextStep: 3,
        },
        {
          buttonText: 'Получить другой рацион',
          messageText: `Напиши другой рацион ${dietPromt}`,
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
            'Продукты куплены. Давай установим уведомления на время приготовления.',
          messageText: `Верни названия времени и время приема пиши из рациона ${day?.diet} в формате чистый json: [{time: null, name: null }]`,
          messageTextVisible:
            'Продукты куплены, давай установим уведомления на время приготовления',
          nextStep: 4,
        },
      ],
    },
    {
      step: 4,
      buttons: [
        {
          buttonText: `Следущий прием пищи: ${nextMealTime?.name} в ${nextMealTime?.time}, Получить рецепт`,
          messageText: `Дай рецепт: ${nextMealTime?.dish} - ${nextMealTime?.dishCalories} в ${nextMealTime?.time}`,
          messageTextVisible: `${nextMealTime?.name} в ${nextMealTime?.time}, Получить рецепт`,
          nextStep: 5,
        },
        {
          buttonText: 'Получить другой рацион',
          messageText: `Напиши другой рацион ${dietPromt}`,
          nextStep: 2,
        },
      ],
    },
    {
      step: 5,
      buttons: [
        {
          buttonText: `Следущий прием пищи: ${nextMealTime?.name} в ${nextMealTime?.time}, Получить рецепт`,
          messageText: `Дай рецепт: ${nextMealTime?.dish} - ${nextMealTime?.dishCalories} в ${nextMealTime?.time}`,
          messageTextVisible: `${nextMealTime?.name} в ${nextMealTime?.time}, Получить рецепт`,
          nextStep: 5,
        },
        {
          buttonText: 'Получить другой рацион',
          messageText: `Напиши другой рацион ${dietPromt}`,
          messageTextVisible: 'Получить другой рацион',
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
    console.log('step ---->', step);
    return messageButtons
      ?.find(i => i.step === step)
      ?.buttons.map((i, key) => {
        console.log('step', step, tooltipStep);
        if (step === 0 || step === 1) {
          return (
            <Tooltip
              key={key}
              animated={true}
              // (Optional) When true,
              // tooltip will animate in/out when showing/hiding
              arrowSize={{width: 16, height: 8}}
              // (Optional) Dimensions of arrow bubble pointing
              // to the highlighted element
              backgroundColor="rgba(0,0,0,0.5)"
              // (Optional) Color of the fullscreen background
              // beneath the tooltip.
              isVisible={
                tooltipStep === 'showGetCaloriesButton' ||
                tooltipStep === 'showGetRationButton'
              }
              // (Must) When true, tooltip is displayed
              content={
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: '#505050',
                      fontWeight: '300',
                    }}>
                    Клините сюда{' '}
                  </Text>
                </View>
              }
              // (Must) This is the view displayed in the tooltip
              placement="top"
              // (Must) top, bottom, left, right, auto.
              onClose={() => {
                if (tooltipStep === 'showGetCaloriesButton') {
                  dispatch(setTooltipStep('showGetRationButton'));
                } else if (tooltipStep === 'showGetRationButton') {
                  dispatch(setTooltipStep('showNexDayButton'));
                }
              }}
              // (Optional) Callback fired when the user taps the tooltip
            >
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
                    // width: '80%',
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
                // width: '80%',
                borderWidth: 1,
                borderColor: '#67CFCF',
                paddingVertical: 5,
                paddingHorizontal: 15,
                maxWidth: '86%',
                flexDirection: 'row',
              }}>
              <Text style={{color: '#3E3E3E', fontSize: 13, fontWeight: '400'}}>
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
  // console.log('lastDay', lastDay);
  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {/*<AgendaComponent onDayPress={d => handleDateSelect(d.dateString)} />*/}
        <Header
          showBack={false}
          navigation={navigation}
          title={
            userData.calories
              ? `Цель на ${moment(selectedDate).format('DD.MM.YYYY')}: ${
                  userData.calories
                }ккал`
              : 'Nutrition consultant GPT'
          }
          showSettingsIcon={true}
        />
        <CurrentWeek
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          toolTipVisible={toolTipVisible}
          setToolTipVisible={setToolTipVisible}
        />
        {/*<CalendarModal*/}
        {/*  minDate={new Date()}*/}
        {/*  maxDate={moment(lastDay?.date).add(1, 'day').toDate()}*/}
        {/*  visible={modalVisible}*/}
        {/*  closeModal={closeModal}*/}
        {/*  onDateSelect={handleDateSelect}*/}
        {/*/>*/}
        {/*<Button title="изменить дату" onPress={openModal} />*/}

        {/* <View>
          <Button title="Display Notification" onPress={() => onDisplayNotification()} />
        </View> */}
        {__DEV__ && (
          <View>
            <Button
              title="Clear all"
              onPress={() => {
                dispatch(setMessagesAction([]));
                dispatch(setStepAction(0, selectedDate));
                dispatch(clearDays());
                dispatch(setCart([]));
                dispatch(setTooltipStep('showGetCaloriesButton'));
                dispatch(setCalories(null));
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

          {/*<View style={styles.inputContainer}>*/}
          {/*  <TextInput*/}
          {/*    style={styles.input}*/}
          {/*    placeholder="Type a message..."*/}
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
  message: {
    // paddingVertical: 10,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
    // flexDirection: 'row',
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
    fontWeight: '300',
  },
  otherMessageText: {
    color: '#505050',
    fontSize: 13,
    fontWeight: '300',
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
