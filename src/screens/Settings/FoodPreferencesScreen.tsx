import React from 'react';
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import MealDataForm from 'features/settings/ui/MealDataForm.tsx';
import FoodPreferencesForm from 'features/settings/ui/FoodPreferencesForm.tsx';

const FoodPreferencesScreen: React.FC = () => {
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <FoodPreferencesForm />
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
});

export default FoodPreferencesScreen;
