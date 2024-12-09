import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const validateNumber = (text: string) => {
    return text.replace(/[^0-9]/g, '');
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Персональные данные</Text>
      <CustomTextInput
        label="Рост (см)"
        placeholder="Введите рост"
        value={height}
        onChangeText={text => setHeight(validateNumber(text))}
        keyboardType="numeric"
        maxLength={3} // Максимальная длина для роста
      />
      <CustomTextInput
        label="Вес (кг)"
        placeholder="Введите вес"
        value={weight}
        onChangeText={text => setWeight(validateNumber(text))}
        keyboardType="numeric"
        maxLength={3} // Максимальная длина для веса
      />
      <CustomTextInput
        label="Возраст (лет)"
        placeholder="Введите возраст"
        value={age}
        onChangeText={text => setAge(validateNumber(text))}
        keyboardType="numeric"
        maxLength={2} // Максимальная длина для возраста
      />
      <SelectInput
        label="Пол"
        value={gender}
        onValueChange={setGender}
        items={[
          {label: 'Мужской', value: 'male'},
          {label: 'Женский', value: 'female'},
          {label: 'Другой', value: 'other'},
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
          disabled={!height || !weight || !age || !gender} // Кнопка "Далее" неактивна, если данные не введены
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
