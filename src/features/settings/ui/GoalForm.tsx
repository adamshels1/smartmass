// src/components/GoalForm.tsx
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'app/providers/StoreProvider/config/store';
import {
  updateGoal,
  updateUserDetails,
} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';
import {Goal} from 'entities/userDetails/model/types/userDetailsTypes.ts';
import {goBack} from '@react-navigation/routers/src/CommonActions.tsx';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';

interface GoalFormProps {
  onNext?: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({onNext}) => {
  const navigation = useAppNavigation();
  const selectedGoal = useSelector(
    (state: RootState) => state.userDetails.userDetails.goal,
  );
  const dispatch: AppDispatch = useDispatch();

  const goals: {label: string; value: Goal}[] = [
    {label: 'Набор веса', value: Goal.GainWeight},
    {label: 'Потеря веса', value: Goal.LoseWeight},
    {label: 'Поддержание формы', value: Goal.MaintainWeight},
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
      <Text style={styles.sectionTitle}>Цель</Text>
      {goals.map(goal => (
        <TouchableOpacity
          key={goal.value}
          style={[
            styles.goalButton,
            selectedGoal === goal.value && styles.selectedGoalButton,
          ]}
          onPress={() => handleSelectGoal(goal.value)}>
          <Text
            style={[
              styles.goalButtonText,
              selectedGoal === goal.value && styles.selectedGoalButtonText,
            ]}>
            {goal.label}
          </Text>
        </TouchableOpacity>
      ))}
      <CustomButton
        title={onNext ? 'Далее' : 'Сохранить'}
        onPress={handleNext}
        style={styles.wideButton}
        disabled={!selectedGoal}
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
