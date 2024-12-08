import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LoginForm from '../components/LoginForm';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});

export default LoginScreen;
