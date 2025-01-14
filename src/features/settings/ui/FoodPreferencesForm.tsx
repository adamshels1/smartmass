import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {
  updateFoodPreferences,
  updateUserDetails,
} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import TagsInput from 'shared/ui/TagsInput/TagsInput';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import {sleep} from 'shared/lib/utils/sleep.js';
import i18n from 'i18next';
import categories from 'features/settings/constants/categories.ts';
interface FoodPreferencesFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const FoodPreferencesForm: React.FC<FoodPreferencesFormProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategories, setShowCategories] = useState<boolean>(
    Boolean(onNext),
  );
  const navigation = useAppNavigation();
  const dispatch: AppDispatch = useDispatch();
  const {preferredFoods, avoidFoods, allergens} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );
  const {user} = useSelector((state: RootState) => state.auth);
  const status = useSelector((state: RootState) => state.userDetails.status);

  const categoryList = categories[user?.language || 'en'];

  useEffect(() => {
    if (categoryList[selectedCategory]) {
      dispatch(
        updateFoodPreferences({preferredFoods: categoryList[selectedCategory]}),
      );
    }
  }, [selectedCategory, dispatch, categoryList]);

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    await sleep(200);
    setShowCategories(false);
  };

  const handleTagsChange = (
    field: keyof RootState['userDetails']['userDetails'],
    value: string[],
  ) => {
    dispatch(updateFoodPreferences({[field]: value}));
  };

  const handleBackToCategories = () => {
    setShowCategories(true);
    setSelectedCategory('');
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
      {showCategories ? (
        <>
          <CustomText style={styles.sectionTitle}>
            {i18n.t('Выбор категории питания')}
          </CustomText>
          {Object.keys(categoryList).map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategorySelect(category)}
              style={[
                styles.sectionItem,
                selectedCategory === category && styles.selectedItem,
              ]}>
              <CustomText style={styles.sectionItemText}>{category}</CustomText>
              <Image
                style={styles.inputIcon}
                source={require('shared/assets/icons/chevron-right.png')}
              />
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <>
          <CustomButton
            title={i18n.t('Назад к категориям')}
            onPress={handleBackToCategories}
            style={StyleSheet.flatten([styles.wideButton, styles.backButton])}
            textStyle={styles.backButtonText}
          />
          <TagsInput
            label={i18n.t('Предпочитаемые продукты')}
            placeholder={i18n.t('Добавить предпочитаемый продукт')}
            value={preferredFoods}
            onChange={tags => handleTagsChange('preferredFoods', tags)}
          />
          <TagsInput
            label={i18n.t('Не предлагать продукты')}
            placeholder={i18n.t('Добавить продукт для избежания')}
            value={avoidFoods}
            onChange={tags => handleTagsChange('avoidFoods', tags)}
          />
          <TagsInput
            label={i18n.t('Аллергены')}
            placeholder={i18n.t('Добавить аллерген')}
            value={allergens}
            onChange={tags => handleTagsChange('allergens', tags)}
          />
          {onNext && onBack ? (
            <View style={styles.buttonContainer}>
              <CustomButton
                title={i18n.t('Назад')}
                onPress={onBack}
                style={StyleSheet.flatten([
                  styles.wideButton,
                  styles.backButton,
                ])}
                textStyle={styles.backButtonText}
              />
              <CustomButton
                title={i18n.t('Далее')}
                onPress={handleNext}
                style={styles.wideButton}
                loading={status === 'loading'}
              />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <CustomButton
                title={i18n.t('Сохранить')}
                onPress={handleNext}
                style={{width: '100%'}}
                loading={status === 'loading'}
              />
            </View>
          )}
        </>
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
  sectionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#E0F7FA',
  },
  sectionItemText: {
    fontSize: 15,
  },
  inputIcon: {
    width: 24,
    height: 24,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 200,
  },
  backButtonText: {
    color: '#31D6D6',
  },
});

export default FoodPreferencesForm;
