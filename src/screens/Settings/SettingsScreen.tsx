import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SettingsMenu} from 'features/settings/ui/SettingsMenu.tsx';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <SettingsMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
