import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import DailyCaloriesForm from 'features/settings/ui/DailyCaloriesForm.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import i18n from 'i18next';

const DailyCaroliesScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title={i18n.t('Калории')} />
      <ScrollView contentContainerStyle={styles.container}>
        <DailyCaloriesForm />
      </ScrollView>
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

export default DailyCaroliesScreen;
