import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import i18n from '../shared/config/i18n';
import {Message} from '../features/chat/index.ts';
const {GoogleGenerativeAI} = require('@google/generative-ai');
import {Flow} from 'react-native-animated-spinkit';
import {
  setCalories,
  setDietAction,
  setMessagesAction,
  setStepAction,
} from '../store/userActions';
import moment from 'moment/moment';
const today = moment();
import CurrentWeek from 'features/chat/ui/CurrentWeek';
import {formatDietDataToString, jsonParse} from 'utils/format';
import {delay} from 'shared/lib/delay';
import ChatInput from 'features/chat/ui/ChatInput';
import InformationSourcesButton from 'features/chat/ui/InformationSourcesButton';
import MessageButtons from 'features/chat/ui/MessageButtons';
import {scheduleMealtimeNotifications} from 'features/chat/model/service/scheduleMealtimeNotifications';
import ResetChatButton from 'features/chat/ui/ResetChatButton';
import {sendMessage} from 'entities/chat/model/services/sendMessage';
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');

export default function ChatScreen({navigation}) {
  const dispatch = useDispatch();
  // const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
  const selectedDate = useSelector(state => state.chat.selectedDate);
  const isBotWriting = useSelector(state => state.chat.isBotWriting);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef(null); // Создание рефа
  const userData = useSelector(state => state.userData);
  const days = useSelector(state => state.userData.days);
  const tooltipStep = useSelector(state => state.userData.tooltipStep);
  const [isVisibleChangePartDiet, setIsVisibleChangePartDiet] = useState(false);
  const [changePartDietOptions, setChangePartDietOptions] = useState([]);
  const [toolTipVisible, setToolTipVisible] = useState(true);
  const disabledSendButton = messageText && !isBotWriting;

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

  const messages = day?.messages || [];
  // const [isBotWriting, setIsBotWriting] = useState(false);
  const isHasSettingsData =
    userData.weight && userData.height && userData.goal && userData.allergies;

  // const handleDateSelect = date => {
  //   setSelectedDate(date);
  // };

  useEffect(() => {
    if (!isHasSettingsData) {
      navigation.navigate('SettingsScreen');
    }
  }, [isHasSettingsData, navigation]);

  const handleSendMessage = async ({
    messageText,
    messageTextVisible,
    nextStep = null,
    changedDiet,
    meal,
  }) => {
    await dispatch(
      sendMessage({
        messageText,
        messageTextVisible,
        nextStep,
        changedDiet,
        meal,
        chatMessagesRef: flatListRef.current,
      }),
    );
    // try {
    //   if (step === 2 && messageText === i18n.t('Change part of the diet')) {
    //     setIsVisibleChangePartDiet(true);
    //     await delay(300);
    //     flatListRef.current.scrollToEnd({animated: true});
    //     return;
    //   }
    //
    //   setIsBotWriting(true);
    //
    //   analytics().logEvent('send_message', {message: messageText});
    //
    //   const newUserMessage = {
    //     role: 'user',
    //     parts: [{text: messageTextVisible ? messageTextVisible : messageText}],
    //   };
    //
    //   dispatch(setMessagesAction([...messages, newUserMessage], selectedDate));
    //
    //   setMessageText('');
    //
    //   await delay(100);
    //
    //   flatListRef.current.scrollToEnd({animated: true});
    //
    //   const deviceId = await DeviceInfo.getUniqueId();
    //
    //   const context = {
    //     contextId: deviceId,
    //     weight: userData.weight,
    //     height: userData.height,
    //     dailyMealStartTime: userData.dailyMealStartTime,
    //     dailyMealEndTime: userData.dailyMealEndTime,
    //     goal: [
    //       userData.goal,
    //       'Разпозновать пищевую ценность продуктов питания',
    //     ],
    //     maxMealPerDay: userData.maxMealPerDay,
    //     description: [
    //       'давай короткие ответы на рецепты',
    //       'если набор массы то давай полезные калорийные продукты такие как авакадо, орехи, какао, сливки',
    //       'если набор массы то можно использовать протеиновые порошки',
    //     ],
    //     allergies: userData.allergies,
    //     preferredProducts: userData.preferredProducts,
    //     likedDishes: userData.likedDishes,
    //     exampleResponseDiet,
    //     diet: day?.diet,
    //   };
    //   console.log('sendMessage', messageText);
    //   const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    //   const result = await model.generateContent(
    //     JSON.stringify({prompt: messageText, context, language: i18n.language}),
    //   );
    //   const response = await result.response;
    //   let text = response.text();
    //   setIsBotWriting(false);
    //
    //   console.log('response', text);
    //   analytics().logEvent('send_message', {response: text});
    //
    //   let data = {};
    //
    //   if (step === 1) {
    //     dispatch(setCalories(text));
    //     text = i18n.t('You need to consume {{calories}} calories per day.', {
    //       calories: text,
    //     });
    //   } else if (step === 2 && changedDiet) {
    //     console.log('changedDiet', changedDiet);
    //     const products = jsonParse(text);
    //     const dietString = formatDietDataToString(changedDiet);
    //     console.log('formatDietDataToString', dietString);
    //     dispatch(setDietAction(changedDiet, products.products, selectedDate));
    //     text = dietString + i18n.t('Total calories: ') + day?.calories;
    //     data.type = 'diet';
    //     data.diet = changedDiet;
    //     data.products = products.products;
    //   } else if (step === 2) {
    //     const diet = jsonParse(text);
    //     const dietString = formatDietDataToString(diet.diet);
    //     console.log('formatDietDataToString', dietString);
    //     dispatch(setDietAction(diet.diet, diet.products, selectedDate));
    //     text = dietString + i18n.t('Total calories: ') + diet.dietTotalCalories;
    //     data.type = 'diet';
    //     data.diet = diet.diet;
    //     data.products = diet.products;
    //   } else if (step === 3) {
    //     const partDietOptions = jsonParse(text);
    //     setIsVisibleChangePartDiet(false);
    //     console.log('partDietOptions.diet', partDietOptions.diet.length);
    //     // return;
    //     setChangePartDietOptions(partDietOptions.diet);
    //     text = i18n.t('Выберите из перечисленных вариантов');
    //   } else if (step === 5) {
    //     await scheduleMealtimeNotifications(day?.diet, selectedDate);
    //     text = i18n.t('Notifications successfully scheduled');
    //   } else if (step === 6) {
    //     data.type = 'recipe';
    //     data.meal = meal;
    //   }
    //
    //   if (text?.length > 3 && step) {
    //     dispatch(setStepAction(step, selectedDate));
    //   }
    //
    //   const newBotMessage = {role: 'model', parts: [{text}], data};
    //   dispatch(
    //     setMessagesAction(
    //       [...messages, newUserMessage, newBotMessage],
    //       selectedDate,
    //     ),
    //   );
    //
    //   await delay(100);
    //
    //   flatListRef.current.scrollToEnd({animated: true});
    //   await delay(2000);
    //   setToolTipVisible(true);
    // } catch (error) {
    //   setIsBotWriting(false);
    //   console.error('Error sending message:', error);
    // }
  };

  // Rendering message element
  const renderMessage = ({item}) => <Message item={item} />;
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
        <CurrentWeek />

        <ResetChatButton
          setIsVisibleChangePartDiet={setIsVisibleChangePartDiet}
          selectedDate={selectedDate}
        />

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

                <MessageButtons
                  chatMessagesRef={flatListRef.current}
                  tooltipStep={tooltipStep}
                  handleSendMessage={handleSendMessage}
                />
                <InformationSourcesButton />
              </View>
            }
          />

          <ChatInput
            messageText={messageText}
            disabledSendButton={disabledSendButton}
            onChangeText={setMessageText}
            onSendMessage={() => {
              handleSendMessage({
                messageText,
              });
            }}
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
    backgroundColor: '#fff',
  },
});
