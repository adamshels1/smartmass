import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import DailyCaloriesForm from 'features/settings/ui/DailyCaloriesForm.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';

const DailyCaroliesScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title="Калории" />
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
