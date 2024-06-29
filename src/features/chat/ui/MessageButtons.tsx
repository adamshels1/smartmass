import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import i18n from 'shared/config/i18n';
import {getCurrentMeal, getNextMeal} from 'utils/helpers';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import Tooltip from 'react-native-walkthrough-tooltip';
import {setTooltipStep} from 'store/userActions';
import {ImagePixabay} from 'shared/ui/ImageByDescription';
import {sortByTime} from 'utils/sort';
import {Meal} from 'features/chat/model/types/diet';
import {SendMessageType} from 'entities/chat/model/types/chat.ts';
import {sendMessage} from 'entities/chat/model/services/sendMessage.ts';

interface MessageButtonsProps {
  tooltipStep: string;
  chatMessagesRef: any;
}

const MessageButtons: React.FC<MessageButtonsProps> = ({
  tooltipStep,
  chatMessagesRef,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userData);
  const selectedDate = useSelector((state: any) => state.chat.selectedDate);
  const isBotWriting = useSelector((state: any) => state.chat.isBotWriting);
  const day = useSelector((state: any) =>
    state.userData?.days?.find((day: any) =>
      moment(day.date).isSame(moment(selectedDate), 'day'),
    ),
  );

  let step = 'get-diet';
  if (!userData?.calories || userData?.calories === '0') {
    step = 'get-calories';
  } else if (day?.step) {
    step = day?.step;
  }

  const handleSendMessage = async ({
    messageText,
    messageTextVisible,
    nextStep = null,
    changedDiet,
    meal,
  }: any) => {
    await dispatch(
      sendMessage({
        messageText,
        messageTextVisible,
        nextStep,
        changedDiet,
        meal,
        chatMessagesRef,
      }),
    );
  };

  const nextMealTime = getNextMeal(day?.diet, selectedDate);
  const currentMealTime = getCurrentMeal(day?.diet, selectedDate);

  const dietPrompt = i18n.t(
    'for one day, following the example of exampleResponseDiet in pure JSON format, so that the total sum of all dishes contains {{calories}} kcal, the total number of meals per day is {{maxMealPerDay}}, and products should contain all the items that need to be purchased for the diet.',
    {
      calories: userData.calories,
      dailyMealStartTime: userData.dailyMealStartTime,
      dailyMealEndTime: userData.dailyMealEndTime,
      maxMealPerDay: userData.maxMealPerDay,
    },
  );

  const changePartDietButtons =
    day?.diet?.length && day?.isVisibleChangePartDiet
      ? sortByTime(day.diet).map((diet: Meal) => ({
          buttonText: i18n.t('Изменить {{name}} в {{time}}', {
            name: diet.name,
            time: diet.time,
          }),
          messageText:
            i18n.t(
              'Дай другие примеры до 20 разных блюд для замены {{name}}, в формате в JSON: ',
              {
                name: diet.name,
              },
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
          nextStep: 'change-part-of-the-diet-results',
        }))
      : [];

  const changePartDietResults = day?.changePartDietResults?.length
    ? day?.changePartDietResults?.map((newMeal: Meal) => {
        const changedDiet = day?.diet?.map((item: Meal) => {
          if (item.time === newMeal.time) {
            return {
              ...item,
              dish: newMeal.dish,
              dishEn: newMeal.dishEn,
              dishCalories: newMeal.dishCalories,
            };
          }
          return item;
        });

        return {
          buttonText: i18n.t('{{dish}}\n{{time}}, {{dishCalories}}', {
            dish: newMeal.dish,
            time: newMeal.time,
            dishCalories: newMeal.dishCalories,
          }),
          changedDiet: changedDiet,
          newMeal: newMeal,
          messageText:
            'Какие продукты необходимы для этого рациона: ' +
            JSON.stringify(changedDiet?.map((item: Meal) => item.dish)) +
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
              time: newMeal.time,
              dish: newMeal.dish,
            },
          ),
          nextStep: 'get-products-and-change-diet', //2
        };
      })
    : [];

  const mealsRecipeButtons = [
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
      nextStep: 'meals-recipe', //6
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
      nextStep: 'meals-recipe', //6
    },
  ];
  const anotherDietButton = {
    buttonText: i18n.t('Get another diet'),
    messageText: i18n.t('Write another diet') + dietPrompt,
    messageTextVisible: i18n.t('Get another diet'),
    nextStep: 'get-products-and-change-diet', //2
  };

  const messageButtons = [
    {
      step: 'get-calories', //0
      buttons: [
        {
          buttonText: i18n.t('How many calories are needed per day?'),
          messageText: i18n.t(
            `Hi! Please send the exact number of necessary calories as a whole number for the goal: ${userData.goal}, for weight: ${userData.weight} kg and height: ${userData.height} cm.`,
          ),
          messageTextVisible: i18n.t(
            'Hello! Send the exact required number of calories',
          ),
          nextStep: 'get-diet',
        },
      ],
    },
    {
      step: 'get-diet', //1
      buttons: [
        {
          buttonText: i18n.t('Get a diet for this day'),
          messageText: i18n.t('Write a diet') + dietPrompt,
          messageTextVisible: i18n.t(
            'Write a diet for 1 day with time and what products need to be bought',
          ),
          nextStep: 'get-products-and-change-diet',
        },
      ],
    },
    {
      step: 'get-products-and-change-diet', //2
      buttons: [
        {
          buttonText: i18n.t('Alright, what products do I need to buy?'),
          messageText:
            i18n.t('Make a shopping list for products:') +
            JSON.stringify(day?.products) +
            '?',
          messageTextVisible: i18n.t('What products to buy'),
          nextStep: 'products-purchased', //4
        },
        anotherDietButton,
        {
          buttonText: i18n.t('Change part of the diet'),
          messageText: i18n.t('Change part of the diet'),
          messageTextVisible: i18n.t('Change part of the diet'),
          nextStep: 'change-part-of-diet-button', //2
        },
        ...changePartDietButtons,
      ],
    },
    {
      step: 'change-part-of-the-diet-results', //3
      buttons: [...changePartDietResults],
    },
    {
      step: 'products-purchased', //4
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
          nextStep: 'set-up-notifications', //5
        },
      ],
    },
    {
      step: 'set-up-notifications', //5
      buttons: [...mealsRecipeButtons, anotherDietButton],
    },
    {
      step: 'meals-recipe', //6
      buttons: [...mealsRecipeButtons, anotherDietButton],
    },
  ];

  if (isBotWriting) {
    return null;
  }

  return (
    <>
      {messageButtons
        .find(i => i.step === step)
        ?.buttons.map((i, key) => {
          if (step === 'get-calories' || step === 'get-diet') {
            return (
              <Tooltip
                key={key}
                // animated={true}
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
                        nextStep: i.nextStep,
                      })
                    }
                    style={styles.button}>
                    <Text style={styles.buttonText}>{i.buttonText}</Text>
                    <Image
                      style={styles.sendIcon}
                      source={require('shared/assets/icons/send.png')}
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
                    nextStep: i.nextStep,
                    meal: i.meal,
                  })
                }
                style={styles.button}>
                {i.newMeal && (
                  <ImagePixabay
                    description={i.newMeal.dishEn}
                    style={{borderRadius: 50, marginRight: 15}}
                    imageStyle={{borderRadius: 50}}
                    size="medium"
                  />
                )}

                <Text style={styles.buttonText}>{i.buttonText}</Text>
                <Image
                  style={styles.sendIcon}
                  source={require('shared/assets/icons/send.png')}
                />
              </TouchableOpacity>
            </View>
          );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F4F4F4',
    borderRadius: 15,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#67CFCF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    maxWidth: '96%',
    flexDirection: 'row',
  },
  buttonText: {
    // textAlign: 'center',
    fontSize: 14,
    color: '#505050',
    fontWeight: '300',
    width: 200,
    // backgroundColor: 'blue',
  },
  sendIcon: {
    width: 15,
    height: 15,
    top: 1.5,
    marginLeft: 10,
  },
});

export default MessageButtons;
