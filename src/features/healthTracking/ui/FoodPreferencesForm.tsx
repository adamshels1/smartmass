import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {
  updateFoodPreferences,
  updateUserDetails,
} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import TagsInput from 'shared/ui/TagsInput/TagsInput';

interface FoodPreferencesFormProps {
  onNext: () => void;
  onBack: () => void;
}

const FoodPreferencesForm: React.FC<FoodPreferencesFormProps> = ({
  onNext,
  onBack,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const {preferredFoods, avoidFoods, allergens} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );

  const handleTagsChange = (
    field: keyof RootState['userDetails']['userDetails'],
    value: string[],
  ) => {
    dispatch(updateFoodPreferences({[field]: value}));
  };

  const handleNext = async () => {
    await dispatch(updateUserDetails());
    onNext();
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Пищевые предпочтения</Text>
      <TagsInput
        label="Предпочитаемые продукты"
        placeholder="Добавить предпочитаемый продукт"
        value={preferredFoods}
        onChange={tags => handleTagsChange('preferredFoods', tags)}
      />
      <TagsInput
        label="Не предлагать продукты"
        placeholder="Добавить продукт для избежания"
        value={avoidFoods}
        onChange={tags => handleTagsChange('avoidFoods', tags)}
      />
      <TagsInput
        label="Аллергены"
        placeholder="Добавить аллерген"
        value={allergens}
        onChange={tags => handleTagsChange('allergens', tags)}
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
