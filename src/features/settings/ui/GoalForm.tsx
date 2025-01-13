import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'app/providers/StoreProvider/config/store';
import {
  updateGoal,
  updateUserDetails,
} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import {Goal} from 'entities/userDetails/model/types/userDetailsTypes.ts';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import i18n from 'i18next';

interface GoalFormProps {
  onNext?: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({onNext}) => {
  const navigation = useAppNavigation();
  const selectedGoal = useSelector(
    (state: RootState) => state.userDetails.userDetails.goal,
  );
  const status = useSelector((state: RootState) => state.userDetails.status);
  const dispatch: AppDispatch = useDispatch();

  const goals: {label: string; value: Goal}[] = [
    {label: i18n.t('Набор веса'), value: Goal.GainWeight},
    {label: i18n.t('Потеря веса'), value: Goal.LoseWeight},
    {label: i18n.t('Поддержание формы'), value: Goal.MaintainWeight},
  ];

  const handleSelectGoal = (goal: Goal) => {
    dispatch(updateGoal(goal));
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
      <CustomText style={styles.sectionTitle}>{i18n.t('Цель')}</CustomText>
      {goals.map(goal => (
        <TouchableOpacity
          key={goal.value}
          style={[
            styles.goalButton,
            selectedGoal === goal.value && styles.selectedGoalButton,
          ]}
          onPress={() => handleSelectGoal(goal.value)}>
          <CustomText
            style={[
              styles.goalButtonText,
              selectedGoal === goal.value && styles.selectedGoalButtonText,
            ]}>
            {goal.label}
          </CustomText>
        </TouchableOpacity>
      ))}
      <CustomButton
        title={onNext ? i18n.t('Далее') : i18n.t('Сохранить')}
        onPress={handleNext}
        style={styles.wideButton}
        disabled={!selectedGoal}
        loading={status === 'loading'}
      />
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
  goalButton: {
    padding: 15,
    borderRadius: 33,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedGoalButton: {
    backgroundColor: '#31D6D6',
  },
  goalButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedGoalButtonText: {
    color: '#fff',
  },
  wideButton: {
    width: '100%',
    marginTop: 20,
  },
});

export default GoalForm;
