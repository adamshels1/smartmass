import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SettingsMenu} from 'features/settings/ui/SettingsMenu.tsx';
import SettingsSteps from 'features/settings/ui/SettingsSteps.tsx';

const SettingsStepsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <SettingsSteps />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsStepsScreen;
