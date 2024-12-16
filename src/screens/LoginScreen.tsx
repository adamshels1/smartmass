import React from 'react';
import {View, StyleSheet} from 'react-native';
import LoginForm from '../entities/auth/ui/LoginForm.tsx';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});

export default LoginScreen;
