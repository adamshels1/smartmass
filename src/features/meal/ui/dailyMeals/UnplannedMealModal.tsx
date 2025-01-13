import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import SelectInput from 'shared/ui/SelectInput/SelectInput.tsx';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {BurgerIcon} from 'shared/assets/icons';
import {sendMessageToAI} from 'entities/chat/model/api/chataiApi.ts';
import {addUnplannedMeal} from 'entities/meal/model/api/mealApi.ts';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {fetchDailyMeals} from 'entities/meal/model/slices/mealSlice.ts';
import {timeItems} from 'features/meal/constants/timeItems.ts';
import {getCurrentTime} from 'shared/lib/utils/timeUtils.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import i18n from 'i18next';
interface UnplannedMealFormProps {
  date: string;
}

const UnplannedMealForm: React.FC<UnplannedMealFormProps> = ({date}) => {
  const [food, setFood] = useState('');
  const [time, setTime] = useState(getCurrentTime());
  const [calories, setCalories] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (food) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        sendMessageToAI('skolko primerno kallorii ' + food, 'integer').then(
          response => {
            if (response && response.aiResponse) {
              setCalories(response.aiResponse);
            }
            setIsLoading(false);
          },
        );
      }, 1000); // Adjust delay as needed
      return () => clearTimeout(timeoutId);
    }
  }, [food]);

  const handleAdd = async () => {
    try {
      setIsButtonLoading(true);
      await addUnplannedMeal(date, food, time, parseInt(calories, 10));
      dispatch(fetchDailyMeals({date}));
      resetState();
      actionSheetRef.current?.hide(); // Закрыть ActionSheet после добавления
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Время занято',
          textBody:
            'В это время вы уже приняли пищу. Пожалуйста, выберите другое время.',
        });
      }
      console.error('Failed to add unplanned meal:', error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const resetState = () => {
    setFood('');
    setTime(getCurrentTime());
    setCalories('');
  };

  const handleShowSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.show();
    } else {
      console.warn('ActionSheet ref is not set');
    }
  };

  const disabledAddButton =
    isButtonLoading || !food || !time || !calories || isLoading;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleShowSheet}>
        <BurgerIcon width={50} height={50} fill={'#ff0000'} />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        containerStyle={styles.sheetContainer}>
        <ScrollView style={styles.sheetContent}>
          <CustomText style={styles.title}>
            {i18n.t('Незапланированный прием пищи')}
          </CustomText>
          <CustomTextInput
            label={i18n.t('Пища')}
            placeholder={i18n.t('Введите пищу')}
            onChangeText={setFood}
            value={food}
          />
          <SelectInput
            label={i18n.t('Время')}
            value={time}
            onValueChange={setTime}
            items={timeItems}
            placeholder={{label: i18n.t('Выберите время'), value: null}}
          />
          <CustomTextInput
            label={i18n.t('Калорийность')}
            placeholder={i18n.t('Введите калорийность')}
            onChangeText={setCalories}
            value={calories}
            keyboardType="numeric"
            maxLength={3} // Максимальная длина для калорий
          />
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="gray"
              style={styles.loader}
            />
          )}
          <CustomButton
            title={i18n.t('Добавить')}
            onPress={handleAdd}
            loading={isButtonLoading}
            disabled={disabledAddButton}
          />
          <CustomButton
            title={i18n.t('Закрыть')}
            onPress={() => actionSheetRef.current?.hide()}
          />
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff', // Белый фон для контейнера
  },
  sheetContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  loader: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default UnplannedMealForm;
