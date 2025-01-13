import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import MealDataForm from 'features/settings/ui/MealDataForm.tsx';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import i18n from 'i18next';

const MealDataScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title={i18n.t('Прием пищи')} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>
          <MealDataForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
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

export default MealDataScreen;
