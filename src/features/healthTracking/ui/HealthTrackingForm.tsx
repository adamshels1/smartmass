// HealthTrackingForm.tsx
import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GoalForm from './GoalForm';
import PersonalDataForm from './PersonalDataForm';
import MealDataForm from './MealDataForm';
import FoodPreferencesForm from './FoodPreferencesForm';
import DailyCaloriesForm from './DailyCaloriesForm';

const HealthTrackingForm: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Добро пожаловать</Text>
        {step === 1 && <GoalForm onNext={handleNext} />}
        {step === 2 && (
          <PersonalDataForm onNext={handleNext} onBack={handleBack} />
        )}
        {step === 3 && <MealDataForm onNext={handleNext} onBack={handleBack} />}
        {step === 4 && (
          <FoodPreferencesForm onNext={handleNext} onBack={handleBack} />
        )}
        {step === 5 && (
          <DailyCaloriesForm onNext={handleNext} onBack={handleBack} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HealthTrackingForm;
