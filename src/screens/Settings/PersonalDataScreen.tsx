import React from 'react';
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import PersonalDataForm from 'features/settings/ui/PersonalDataForm.tsx';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import i18n from 'i18next';

const PersonalDataScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title={i18n.t('Персональные данные')} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>
          <PersonalDataForm />
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

export default PersonalDataScreen;
