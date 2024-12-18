import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {
  updateMealData,
  updateUserDetails,
} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import SelectInput from 'shared/ui/SelectInput/SelectInput';

interface MealDataFormProps {
  onNext: () => void;
  onBack: () => void;
}

const MealDataForm: React.FC<MealDataFormProps> = ({onNext, onBack}) => {
  const dispatch: AppDispatch = useDispatch();
  const {maxMealPerDay, dailyMealStartTime, dailyMealEndTime} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );

  const handleChange = (
    field: keyof RootState['userDetails']['userDetails'],
    value: string,
  ) => {
    dispatch(updateMealData({[field]: value}));
  };

  const handleNext = async () => {
    await dispatch(updateUserDetails());
    onNext();
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Прием пищи</Text>
      <SelectInput
        label="Первый прием"
        value={dailyMealStartTime}
        onValueChange={value => handleChange('dailyMealStartTime', value)}
        items={[
          {label: '6:00', value: '6:00'},
          {label: '7:00', value: '7:00'},
          {label: '8:00', value: '8:00'},
          {label: '9:00', value: '9:00'},
          {label: '10:00', value: '10:00'},
          // Добавьте другие временные метки по необходимости
        ]}
        placeholder={{label: 'Выберите время', value: null}}
      />
      <SelectInput
        label="Последний прием"
        value={dailyMealEndTime}
        onValueChange={value => handleChange('dailyMealEndTime', value)}
        items={[
          {label: '17:00', value: '17:00'},
          {label: '18:00', value: '18:00'},
          {label: '19:00', value: '19:00'},
          {label: '20:00', value: '20:00'},
          {label: '21:00', value: '21:00'},
          // Добавьте другие временные метки по необходимости
        ]}
        placeholder={{label: 'Выберите время', value: null}}
      />
      <SelectInput
        label="Количество приемов"
        value={maxMealPerDay?.toString()}
        onValueChange={value => handleChange('maxMealPerDay', value)}
        items={[
          {label: '1', value: '1'},
          {label: '2', value: '2'},
          {label: '3', value: '3'},
          {label: '4', value: '4'},
          {label: '5', value: '5'},
          {label: '6', value: '6'},
          {label: '7', value: '7'},
          // Добавьте другие варианты по необходимости
        ]}
        placeholder={{label: 'Выберите количество', value: null}}
      />
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
          disabled={!dailyMealStartTime || !dailyMealEndTime || !maxMealPerDay}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
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
});

export default MealDataForm;
