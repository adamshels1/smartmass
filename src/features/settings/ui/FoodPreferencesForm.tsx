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

interface FoodPreferencesFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const categories: {[key: string]: string[]} = {
  'Спортивное питание': [
    'белковые коктейли',
    'овсянка',
    'куриная грудка',
    'бананы',
    'гречка',
    'орехи',
    'рыба (лосось, тунец)',
  ],
  'Диетическое питание': [
    'салаты',
    'нежирные белки',
    'овощи',
    'фрукты',
    'йогурты',
    'творог',
    'гречка',
  ],
  'Вегетарианское питание': [
    'тофу',
    'авокадо',
    'киноа',
    'зелёные смузи',
    'нут',
    'соя',
    'баклажаны',
    'цуккини',
  ],
  'Веганское питание': [
    'растительное молоко',
    'ореховые пасты',
    'тофу',
    'сейтан',
    'бобы',
    'овощные супы',
    'фрукты',
    'орехи',
  ],
  'Кето питание': [
    'яйца',
    'жирное мясо',
    'сыр',
    'сливочное масло',
    'авокадо',
    'кето-десерты',
    'оливковое масло',
    'рыба',
  ],
  'Палео питание': [
    'мясо',
    'рыба',
    'овощи',
    'фрукты',
    'орехи',
    'семена',
    'оливковое масло',
    'сладкий картофель',
  ],
  'Сбалансированное питание': [
    'цельнозерновые продукты',
    'курица',
    'рыба',
    'овощи',
    'фрукты',
    'йогурты',
    'яйца',
    'растительные масла',
  ],
  'Безглютеновое питание': [
    'рис',
    'гречка',
    'кукурузная мука',
    'овощи',
    'фрукты',
    'мясо',
    'рыба',
    'безглютеновая паста',
  ],
  'Низкоуглеводное питание': [
    'яйца',
    'куриная грудка',
    'рыба',
    'овощи с низким содержанием углеводов (брокколи, цветная капуста)',
    'сыр',
    'авокадо',
    'орехи',
    'оливковое масло',
  ],
  'Средиземноморская диета': [
    'оливковое масло',
    'рыба',
    'морепродукты',
    'овощи',
    'фрукты',
    'цельнозерновые продукты',
    'греческий йогурт',
    'вино (в умеренных количествах)',
  ],
};

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

  useEffect(() => {
    if (categories[selectedCategory]) {
      dispatch(
        updateFoodPreferences({preferredFoods: categories[selectedCategory]}),
      );
    }
  }, [selectedCategory, dispatch]);

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
            Выбор категории питания
          </CustomText>
          {Object.keys(categories).map(category => (
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
                source={require('assets/icons/chevron-right.png')}
              />
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <>
          <CustomButton
            title="Назад к категориям"
            onPress={handleBackToCategories}
            style={StyleSheet.flatten([styles.wideButton, styles.backButton])}
            textStyle={styles.backButtonText}
          />
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
          {onNext && onBack ? (
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Назад"
                onPress={onBack}
                style={StyleSheet.flatten([
                  styles.wideButton,
                  styles.backButton,
                ])}
                textStyle={styles.backButtonText}
              />
              <CustomButton
                title="Далее"
                onPress={handleNext}
                style={styles.wideButton}
              />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Сохранить"
                onPress={handleNext}
                style={{width: '100%'}}
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
