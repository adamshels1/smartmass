import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput';

interface FoodPreferencesFormProps {
  onNext: (data: {
    preferredFoods: string[];
    avoidFoods: string[];
    allergens: string[];
  }) => void;
  onBack: () => void;
}

const FoodPreferencesForm: React.FC<FoodPreferencesFormProps> = ({
  onNext,
  onBack,
}) => {
  const [preferredFoods, setPreferredFoods] = useState<string[]>([]);
  const [avoidFoods, setAvoidFoods] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setter(value.split(',').map(item => item.trim()));
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Пищевые предпочтения</Text>
      <CustomTextInput
        placeholder="Предпочитаемые продукты (через запятую)"
        value={preferredFoods.join(', ')}
        onChangeText={text => handleInputChange(setPreferredFoods, text)}
      />
      <CustomTextInput
        placeholder="Не предлагать продукты (через запятую)"
        value={avoidFoods.join(', ')}
        onChangeText={text => handleInputChange(setAvoidFoods, text)}
      />
      <CustomTextInput
        placeholder="Аллергены (через запятую)"
        value={allergens.join(', ')}
        onChangeText={text => handleInputChange(setAllergens, text)}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Назад"
          onPress={onBack}
          style={StyleSheet.flatten([styles.wideButton, styles.backButton])}
          textStyle={styles.backButtonText}
        />
        <CustomButton
          title="Сохранить и продолжить"
          onPress={() => onNext({preferredFoods, avoidFoods, allergens})}
          style={styles.wideButton}
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

export default FoodPreferencesForm;
