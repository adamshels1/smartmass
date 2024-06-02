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
import {Calendar, LocaleConfig} from 'react-native-calendars';
import i18n from '../shared/config/i18n';

const {GoogleGenerativeAI} = require('@google/generative-ai');

import {Flow} from 'react-native-animated-spinkit';
import {
  clearDays,
  setCalories,
  setDietAction,
  setMealtimesAction,
  setMessagesAction,
  setStepAction,
  setCart,
} from '../store/userActions';
import AgendaComponent from '../components/AgendaComponent';
import LottieView from 'lottie-react-native';

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
import {jsonParse, sumAmountByName} from '../utils/format';
export default function CartScreen({navigation}) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
  const [messageText, setMessageText] = useState('');
  // const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null); // Создание рефа
  const userData = useSelector(state => state.userData);
  const days = useSelector(state => state.userData.days);
  // console.log('days', days);
  const day = useSelector(state =>
    state.userData?.days?.find(day =>
      moment(day.date).isSame(moment(selectedDate), 'day'),
    ),
  );
  const lastDay = days?.[days?.length - 1];
  // console.log('userData', userData);
  const messages = day?.messages || [];
  // console.log('messages', messages);
  // const step = useSelector(state => state.userData.step);
  let step = 1;
  // console.log('step', step);
  if (!userData?.calories) {
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

  async function onCreateTriggerNotification(time, title, body) {
    try {
      const date = new Date(Date.now());
      date.setHours(12);
      date.setMinutes(12);

      // Create a time-based trigger
      const trigger = {
        type: TriggerType.TIMESTAMP,
        // timestamp: Date.now() + (1000 * 10), // fire at 11:10am (10 minutes before meeting)
        timestamp: getTimeStamp(time) - 1000 * 30, //  (30 minutes before mealtime)
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
      // console.log('res', res);
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

  const scheduleMealtimeNotifications = async (mealtimes, date) => {
    try {
      dispatch(setMealtimesAction(JSON.parse(mealtimes), date));

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

  const handleSendMessage = async ({
    messageText,
    messageTextVisible,
    step = null,
  }) => {
    try {
      setIsBotWriting(true);

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

      flatListRef?.current?.scrollToEnd({animated: true});

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

      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const result = await model.generateContent(
        JSON.stringify({prompt: messageText, context}),
      );
      const response = await result.response;
      let text = response.text();
      setIsBotWriting(false);

      console.log('step', step, text);

      if (step === 1) {
        dispatch(setCalories(text));
        text = `Вам необходимо набрать ${text} калорий за один день.`;
      } else if (step === 2) {
        dispatch(setDietAction(text, selectedDate));
      } else if (step === 4) {
        await scheduleMealtimeNotifications(text, selectedDate);
        text = 'Нотификации успешно запланированы';
      } else if (step === 99) {
        console.log('cart', jsonParse(text));
        dispatch(setCart(jsonParse(text)));
        // text = 'Нотификации успешно запланированы';
      }

      if (text?.length > 3 && step) {
        dispatch(setStepAction(step + 1, selectedDate));
      }

      const newBotMessage = {role: 'model', parts: [{text}]};
      dispatch(
        setMessagesAction(
          [...messages, newUserMessage, newBotMessage],
          selectedDate,
        ),
      );

      await sleep(100);

      flatListRef?.current?.scrollToEnd({animated: true});
    } catch (error) {
      setIsBotWriting(false);
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  useEffect(() => {
    generateCart();
  }, [days]);

  const generateCart = async () => {
    setIsBotWriting(true);
    await sleep(1500);
    const mergedData = days.flatMap(i => i.products);
    const summedData = sumAmountByName(mergedData);
    console.log('summedData', summedData);
    dispatch(setCart(summedData));
    setIsBotWriting(false);
    // await sleep(10000);
    // const message =
    //   'Объедини одинаковые продукты по названию name даже если называются по разному, не должно быть дубликатов, суммируй amount, сделай сортировку по категориям, и верни в формате JSON :' +
    //   JSON.stringify(summedData);
    // handleSendMessage({
    //   messageText: message,
    //   messageTextVisible: message,
    //   step: 99,
    // });
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

  const nextMealTime = getNextMeal(day?.mealtimes);

  const dietPromt = `на 1 день со временем и какие продукты нужно купить по сколько грамм для этого рациона, до 15 продуктов, и напиши каларийность по примеру exampleResponseDiet, что бы в рационе обязательно было ${userData.calories}ккал, перый прием пищи в ${userData.dailyMealStartTime}, последний прием пищи в ${userData.dailyMealEndTime} должен быть перекус, общее количество приемов пищи ${userData.maxMealPerDay}`;

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
          messageText:
            'Какие продукты закупить  на рацион и по сколько грамм из контекста diet?',
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
            'Продукты куплены, давай установим уведомления на время приготовления',
          messageText:
            'Верни названия времени и время приема пиши из рациона контекста diet в формате чистый json: [{time: null, name: null }]',
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
          messageText: `Дай из контеста diet рецепт, и как приготовить: ${nextMealTime?.name}} в ${nextMealTime?.time}`,
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
          messageText: `Дай из контеста diet рецепт, и как приготовить: ${nextMealTime?.name}} в ${nextMealTime?.time}`,
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
  // console.log('lastDay', lastDay);
  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {/*<AgendaComponent onDayPress={d => handleDateSelect(d.dateString)} />*/}
        <Header
          showBack={true}
          navigation={navigation}
          title={i18n.t('Cart')}
        />
        <CurrentWeek
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />

        {/*<Button title="изменить дату" onPress={openModal} />*/}

        {/* <View>
          <Button title="Display Notification" onPress={() => onDisplayNotification()} />
        </View> */}

        {/*{__DEV__ && (*/}
        {/*<View>*/}
        {/*  <Button*/}
        {/*    title="Сформировать корзину продуктов"*/}
        {/*    onPress={generateCart}*/}
        {/*  />*/}
        {/*</View>*/}
        {/*)}*/}

        {/*{__DEV__ && (*/}
        {/*  <View>*/}
        {/*    <Button*/}
        {/*      title="Schedule Notification"*/}
        {/*      onPress={() => onCreateTriggerNotification('aaa', 'bbbb')}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*)}*/}

        {isBotWriting ? (
          <View>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                color: '#67CFCF',
                fontSize: 20,
              }}>
              {i18n.t('Shopping Cart Creation')}
            </Text>
            <LottieView
              style={{
                width: 300,
                height: 300,
                alignSelf: 'center',
                fontWeight: 'bold',
              }}
              source={require('../assets/animations/Animation - 1715423113634.json')} // Путь к файлу анимации
              autoPlay
              loop
            />
          </View>
        ) : (
          <FlatList
            style={{height: 20, paddingHorizontal: 10}}
            ref={flatListRef} // Передача рефа
            data={userData.cart.sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            })}
            renderItem={({item, key}) => {
              return (
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    const cart = userData.cart.map(i => {
                      if (i.name === item.name) {
                        i.purchased = !i.purchased;
                      }
                      return i;
                    });
                    dispatch(setCart(cart));
                  }}>
                  <Image
                    style={{width: 25, height: 25, top: 6, marginRight: 7}}
                    source={
                      item?.purchased
                        ? require('../assets/icons/checklist.png')
                        : require('../assets/icons/eclipse.png')
                    }
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 15,
                      color: '#505050',
                      fontWeight: '300',
                    }}>
                    {item.name + ' - ' + item.amount + item.units}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <Text style={{fontSize: 17, color: '#505050', fontWeight: '500'}}>
                {i18n.t('Products to Buy:')}
              </Text>
            )}
            // ListFooterComponent={() => <Button title={'Продукты куплены'} />}
          />
        )}

        {/*<View style={styles.container}>*/}
        {/*  <FlatList*/}
        {/*    contentInsetAdjustmentBehavior="automatic"*/}
        {/*    ref={flatListRef} // Передача рефа*/}
        {/*    data={messages}*/}
        {/*    renderItem={renderMessage}*/}
        {/*    keyExtractor={(item, index) => index.toString()}*/}
        {/*    contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}*/}
        {/*    ListFooterComponent={*/}
        {/*      <View style={{marginBottom: 10}}>*/}
        {/*        {isBotWriting && (*/}
        {/*          <Flow style={{marginLeft: 15}} size={48} color="#A1A1A1" />*/}
        {/*        )}*/}

        {/*        /!* {isBotWriting && (*/}
        {/*        <Image style={{ width: 80, height: 50, marginBottom: 0 }} resizeMode='contain' source={require('../assets/animations/writing.gif')} />*/}
        {/*      )} *!/*/}

        {/*        {renderMessageButtons()}*/}
        {/*      </View>*/}
        {/*    }*/}
        {/*  />*/}

        {/*  <View style={styles.inputContainer}>*/}
        {/*    <TextInput*/}
        {/*      style={styles.input}*/}
        {/*      placeholder="Type a message..."*/}
        {/*      placeholderTextColor="#A1A1A1"*/}
        {/*      onChangeText={text => setMessageText(text)}*/}
        {/*      value={messageText}*/}
        {/*      multiline={true}*/}
        {/*      numberOfLines={4}*/}
        {/*      textAlignVertical="center"*/}
        {/*    />*/}
        {/*    <TouchableOpacity*/}
        {/*      onPress={() =>*/}
        {/*        handleSendMessage({*/}
        {/*          messageText,*/}
        {/*        })*/}
        {/*      }*/}
        {/*      disabled={!disabledSendButton}*/}
        {/*      style={{opacity: disabledSendButton ? 1 : 0.5}}>*/}
        {/*      <Image*/}
        {/*        style={{width: 30, height: 30}}*/}
        {/*        source={require('../assets/icons/send.png')}*/}
        {/*      />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}
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
