// src/components/GoalForm.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from 'app/providers/StoreProvider/config/store';
import {selectGoal} from 'entities/userDetails/model/slices/userDetailsSlice';
import CustomButton from 'shared/ui/CustomButton/CustomButton';

interface GoalFormProps {
  onNext: (data: {goal: string}) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({onNext}) => {
  const selectedGoal = useSelector(
    (state: RootState) => state.userDetails.selectedGoal,
  );
  console.log('selectedGoal', selectedGoal);
  const dispatch: AppDispatch = useDispatch();

  const goals = [
    {label: 'Набор веса', value: 'weight_gain'},
    {label: 'Потеря веса', value: 'weight_loss'},
    {label: 'Поддержание формы', value: 'maintenance'},
  ];

  const handleSelectGoal = (goal: string) => {
    dispatch(selectGoal(goal));
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
        title="Далее"
        onPress={() => onNext({goal: selectedGoal})}
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
    fontSize: 16,
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
