import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {
  updatePersonalData,
  updateUserDetails,
} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput';
import SelectInput from 'shared/ui/SelectInput/SelectInput';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import i18n from 'i18next';

interface PersonalDataFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({
  onNext,
  onBack,
}) => {
  const navigation = useAppNavigation();
  const dispatch: AppDispatch = useDispatch();
  const {height, weight, targetWeight, age, gender} = useSelector(
    (state: RootState) => state.userDetails.userDetails,
  );
  const status = useSelector((state: RootState) => state.userDetails.status);

  const validateNumber = (text: string) => text.replace(/[^0-9]/g, '');

  const handleChange = (
    field: keyof RootState['userDetails']['userDetails'],
    value: string,
  ) => {
    dispatch(updatePersonalData({[field]: value}));
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
      <CustomText style={styles.sectionTitle}>
        {i18n.t('Персональные данные')}
      </CustomText>
      <CustomTextInput
        label={i18n.t('Рост (см)')}
        placeholder={i18n.t('Введите рост')}
        value={height?.toString()}
        onChangeText={text => handleChange('height', validateNumber(text))}
        keyboardType="numeric"
        maxLength={3}
      />
      <CustomTextInput
        label={i18n.t('Вес (кг)')}
        placeholder={i18n.t('Введите вес')}
        value={weight?.toString()}
        onChangeText={text => handleChange('weight', validateNumber(text))}
        keyboardType="numeric"
        maxLength={3}
      />
      <CustomTextInput
        label={i18n.t('Целевой вес (кг)')}
        placeholder={i18n.t('Введите целевой вес')}
        value={targetWeight?.toString()}
        onChangeText={text =>
          handleChange('targetWeight', validateNumber(text))
        }
        keyboardType="numeric"
        maxLength={3}
      />
      <CustomTextInput
        label={i18n.t('Возраст (лет)')}
        placeholder={i18n.t('Введите возраст')}
        value={age?.toString()}
        onChangeText={text => handleChange('age', validateNumber(text))}
        keyboardType="numeric"
        maxLength={2}
      />
      <SelectInput
        label={i18n.t('Пол')}
        value={gender}
        onValueChange={value => handleChange('gender', value)}
        items={[
          {label: i18n.t('Мужской'), value: 'male'},
          {label: i18n.t('Женский'), value: 'female'},
        ]}
        placeholder={{label: i18n.t('Выберите пол'), value: null}}
      />
      {onNext && onBack ? (
        <View style={styles.buttonContainer}>
          <CustomButton
            title={i18n.t('Назад')}
            onPress={onBack}
            style={StyleSheet.flatten([styles.wideButton, styles.backButton])}
            textStyle={styles.backButtonText}
          />
          <CustomButton
            title={i18n.t('Далее')}
            onPress={handleNext}
            style={styles.wideButton}
            disabled={!height || !weight || !targetWeight || !age || !gender}
            loading={status === 'loading'}
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <CustomButton
            title={i18n.t('Сохранить')}
            onPress={handleNext}
            style={{width: '100%'}}
            disabled={!height || !weight || !targetWeight || !age || !gender}
            loading={status === 'loading'}
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
});

export default PersonalDataForm;
