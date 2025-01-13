import React from 'react';
import {View, StyleSheet} from 'react-native';
import GoalForm from 'features/settings/ui/GoalForm.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import i18n from 'i18next';

const GoalScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title={i18n.t('Цель')} />
      <View style={styles.container}>
        <GoalForm />
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default GoalScreen;
