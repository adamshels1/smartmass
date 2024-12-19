import React from 'react';
import {View, StyleSheet} from 'react-native';
import GoalForm from 'features/settings/ui/GoalForm.tsx';

const GoalScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <GoalForm />
    </View>
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
