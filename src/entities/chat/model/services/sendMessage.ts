import {Dispatch} from 'redux';
import i18n from 'shared/config/i18n';
import {delay} from 'shared/lib/delay';
import analytics from '@react-native-firebase/analytics';
import {
  setCalories,
  setChangePartDietResults,
  setDietAction,
  setIsVisibleChangePartDiet,
  setMessagesAction,
  setStepAction,
} from 'store/userActions.js';
import DeviceInfo from 'react-native-device-info';
import {formatDietDataToString, jsonParse} from 'utils/format.js';
import {scheduleMealtimeNotifications} from 'features/chat/model/service/scheduleMealtimeNotifications.ts';
import {SendMessageType} from 'entities/chat/model/types/chat.ts';
import {setIsBotWriting} from 'entities/chat/model/store/chatActions.js';
import moment from 'moment';
import {GoogleGenerativeAI} from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyBZamTEjnnSf5ZiPpSLG2q8Lgq8eDuNIBE');

export const sendMessage = ({
  messageText,
  messageTextVisible,
  nextStep,
  changedDiet,
  meal,
  chatMessagesRef,
}: SendMessageType) => {
  return async (dispatch: Dispatch, getState: () => any) => {
    try {
      const selectedDate = getState().chat.selectedDate;
      const day = getState().userData?.days?.find(day =>
        moment(day.date).isSame(moment(selectedDate), 'day'),
      );
      const userData = getState().userData;

      const messages = day?.messages || [];

      if (nextStep === 'change-part-of-diet-button') {
        // setIsVisibleChangePartDiet(true);
        dispatch(setIsVisibleChangePartDiet(true, selectedDate));
        await delay(300);
        chatMessagesRef.scrollToEnd({animated: true});
        return;
      }

      dispatch(setIsBotWriting(true));

      analytics().logEvent('send_message', {message: messageText});

      const newUserMessage = {
        role: 'user',
        parts: [{text: messageTextVisible ? messageTextVisible : messageText}],
      };

      dispatch(setMessagesAction([...messages, newUserMessage], selectedDate));

      // setMessageText('');

      await delay(100);

      chatMessagesRef.scrollToEnd({animated: true});

      const deviceId = await DeviceInfo.getUniqueId();

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
      dispatch(setIsBotWriting(false));

      console.log('response', text);
      analytics().logEvent('send_message', {response: text});

      let data: any = {};

      if (nextStep === 'get-diet') {
        dispatch(setCalories(text));
        text = i18n.t('You need to consume {{calories}} calories per day.', {
          calories: text,
        });
      } else if (nextStep === 'get-products-and-change-diet' && changedDiet) {
        console.log('changedDiet', changedDiet);
        const products = jsonParse(text);
        const dietString = formatDietDataToString(changedDiet);
        console.log('formatDietDataToString', dietString);
        dispatch(setDietAction(changedDiet, products.products, selectedDate));
        text = dietString + i18n.t('Total calories: ') + day?.calories;
        data.type = 'diet';
        data.diet = changedDiet;
        data.products = products.products;
      } else if (nextStep === 'get-products-and-change-diet') {
        const diet = jsonParse(text);
        const dietString = formatDietDataToString(diet.diet);
        console.log('formatDietDataToString', dietString);
        dispatch(setDietAction(diet.diet, diet.products, selectedDate));
        text = dietString + i18n.t('Total calories: ') + diet.dietTotalCalories;
        data.type = 'diet';
        data.diet = diet.diet;
        data.products = diet.products;
      } else if (nextStep === 'change-part-of-the-diet-results') {
        const partDietResults = jsonParse(text);
        dispatch(setIsVisibleChangePartDiet(false, selectedDate));
        dispatch(setChangePartDietResults(partDietResults.diet, selectedDate));
        text = i18n.t('Выберите из перечисленных вариантов');
      } else if (nextStep === 'set-up-notifications') {
        await scheduleMealtimeNotifications(day?.diet, selectedDate);
        text = i18n.t('Notifications successfully scheduled');
      } else if (nextStep === 'meals-recipe') {
        data.type = 'recipe';
        data.meal = meal;
      }

      dispatch(setStepAction(nextStep, selectedDate));

      // if (text?.length > 3 && nextStep) {
      //   dispatch(setStepAction(nextStep, selectedDate));
      // }

      console.log('text', text);
      const newBotMessage = {role: 'model', parts: [{text}], data};
      dispatch(
        setMessagesAction(
          [...messages, newUserMessage, newBotMessage],
          selectedDate,
        ),
      );

      await delay(100);
      chatMessagesRef.scrollToEnd({animated: true});
      await delay(2000);
      // setToolTipVisible(true);
    } catch (error) {
      dispatch(setIsBotWriting(false));
      console.error('Error sending message:', error);
    }
  };
};
