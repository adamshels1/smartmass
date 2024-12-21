import React, {ReactNode} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

interface Props {
  children: ReactNode;
}

export const AppLayout = ({children}: Props) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});
