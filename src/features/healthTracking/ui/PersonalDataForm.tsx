// src/components/PersonalDataForm.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {updatePersonalData} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput';
import SelectInput from 'shared/ui/SelectInput/SelectInput';

interface PersonalDataFormProps {
  onNext: (data: {
    height: string;
    weight: string;
    age: string;
    gender: string;
  }) => void;
  onBack: () => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({
  onNext,
  onBack,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const {height, weight, age, gender} = useSelector(
    (state: RootState) => state.userDetails,
  );

  const validateNumber = (text: string) => text.replace(/[^0-9]/g, '');

  const handleChange = (
    field: keyof RootState['userDetails'],
    value: string,
  ) => {
    dispatch(updatePersonalData({[field]: value}));
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Персональные данные</Text>
      <CustomTextInput
        label="Рост (см)"
        placeholder="Введите рост"
        value={height}
        onChangeText={text => handleChange('height', validateNumber(text))}
        keyboardType="numeric"
        maxLength={3}
      />
      <CustomTextInput
        label="Вес (кг)"
        placeholder="Введите вес"
        value={weight}
        onChangeText={text => handleChange('weight', validateNumber(text))}
        keyboardType="numeric"
        maxLength={3}
      />
      <CustomTextInput
        label="Возраст (лет)"
        placeholder="Введите возраст"
        value={age}
        onChangeText={text => handleChange('age', validateNumber(text))}
        keyboardType="numeric"
        maxLength={2}
      />
      <SelectInput
        label="Пол"
        value={gender}
        onValueChange={value => handleChange('gender', value)}
        items={[
          {label: 'Мужской', value: 'male'},
          {label: 'Женский', value: 'female'},
        ]}
        placeholder={{label: 'Выберите пол', value: null}}
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
          onPress={() => onNext({height, weight, age, gender})}
          style={styles.wideButton}
          disabled={!height || !weight || !age || !gender}
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

export default PersonalDataForm;
