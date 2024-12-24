import React, {useState} from 'react';
import {
  View,
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
import {Success} from 'screens/Settings/Success.tsx';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

const SettingsSteps: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const renderStepIndicators = () => {
    const steps = [1, 2, 3, 4, 5];
    return (
      <View style={styles.stepsContainer}>
        {steps.map((item, index) => (
          <View key={index} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                step >= item && styles.stepCircleActive,
              ]}>
              <CustomText style={styles.stepText}>{item}</CustomText>
            </View>
            {index < steps.length - 1 && <View style={styles.stepLine} />}
          </View>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/*<CustomText style={styles.title}>Добро пожаловать</CustomText>*/}
        {step !== 6 && renderStepIndicators()}
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
        {step === 6 && <Success />}
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
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  stepCircleActive: {
    backgroundColor: '#31D6D6',
    borderColor: '#31D6D6',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepLine: {
    width: 20,
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default SettingsSteps;
