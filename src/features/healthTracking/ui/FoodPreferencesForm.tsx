// src/components/FoodPreferencesForm.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {updateFoodPreferences} from 'entities/userDetails/model/slices/userDetailsSlice';
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
  const dispatch: AppDispatch = useDispatch();
  const {preferredFoods, avoidFoods, allergens} = useSelector(
    (state: RootState) => state.userDetails,
  );

  const handleInputChange = (
    field: keyof RootState['userDetails'],
    value: string[],
  ) => {
    dispatch(updateFoodPreferences({[field]: value}));
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Пищевые предпочтения</Text>
      <CustomTextInput
        placeholder="Предпочитаемые продукты (через запятую)"
        value={preferredFoods.join(', ')}
        onChangeText={text =>
          handleInputChange(
            'preferredFoods',
            text.split(',').map(item => item.trim()),
          )
        }
      />
      <CustomTextInput
        placeholder="Не предлагать продукты (через запятую)"
        value={avoidFoods.join(', ')}
        onChangeText={text =>
          handleInputChange(
            'avoidFoods',
            text.split(',').map(item => item.trim()),
          )
        }
      />
      <CustomTextInput
        placeholder="Аллергены (через запятую)"
        value={allergens.join(', ')}
        onChangeText={text =>
          handleInputChange(
            'allergens',
            text.split(',').map(item => item.trim()),
          )
        }
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
