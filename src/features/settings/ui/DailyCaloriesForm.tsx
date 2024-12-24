// DailyCaloriesForm.tsx
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {
  updatePersonalData,
  updateUserDetails,
} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput';
import {sendMessageToAI} from 'entities/chat/model/api/chataiApi';
import {jsonParse} from 'utils/format.js';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';

interface DailyCaloriesFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const DailyCaloriesForm: React.FC<DailyCaloriesFormProps> = ({
  onNext,
  onBack,
}) => {
  const navigation = useAppNavigation();
  const dispatch: AppDispatch = useDispatch();
  const {height, weight, age, gender, targetWeight, goal} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );

  const [recommendedCalories, setRecommendedCalories] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [timeToReachGoal, setTimeToReachGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(updateUserDetails());

      const prompt = `Сколько необходимо употреблять калорий в день с такими параметрами: Рост: ${height}, Вес: ${weight}, Возраст: ${age}, Пол: ${gender}, Целевой вес: ${targetWeight}, Цель: ${goal}, за какое время можно достичь этой цели`;

      const responseFormat = `{
        "calories": "integer",
        "time": "months"
      }`;

      sendMessageToAI(prompt, responseFormat).then(response => {
        if (response && response.aiResponse) {
          const {calories, time} = jsonParse(response.aiResponse);
          setRecommendedCalories(calories);
          setDailyCalories(calories.toString());
          setTimeToReachGoal(time);
          dispatch(updatePersonalData({dailyCalories: Number(calories)}));
        }
        setIsLoading(false);
      });
    };

    fetchData();
  }, []);

  const validateNumber = (text: string) => text.replace(/[^0-9]/g, '');

  const handleChange = (text: string) => {
    const validatedCalories = validateNumber(text);
    setDailyCalories(validatedCalories);
    dispatch(updatePersonalData({dailyCalories: Number(validatedCalories)}));
  };

  const handleNext = async () => {
    await dispatch(updateUserDetails());
    if (onNext) {
      onNext();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.stepContainer}>
      {isLoading && <ActivityIndicator size="large" color="#31D6D6" />}
      {recommendedCalories && (
        <Text style={styles.caloriesText}>
          Вам необходимо употреблять {recommendedCalories} ккал в день, чтобы
          достичь цели: {goal}. Примерное время для достижения цели:{' '}
          {timeToReachGoal} месяцев.
        </Text>
      )}
      <CustomTextInput
        label="Введите количество калорий"
        placeholder="Введите количество калорий"
        value={dailyCalories}
        onChangeText={handleChange}
        keyboardType="numeric"
        maxLength={4}
      />

      {onNext && onBack ? (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Назад"
            onPress={onBack}
            style={StyleSheet.flatten([styles.wideButton, styles.backButton])}
            textStyle={styles.backButtonText}
          />
          <CustomButton
            title="Далее"
            onPress={handleNext}
            style={styles.wideButton}
            disabled={!dailyCalories || isLoading}
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Сохранить"
            onPress={handleNext}
            style={{width: '100%'}}
            disabled={!dailyCalories || isLoading}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  wideButton: {
    width: '48%',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#31D6D6',
  },
  backButtonText: {
    color: '#31D6D6',
  },
  caloriesText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DailyCaloriesForm;
