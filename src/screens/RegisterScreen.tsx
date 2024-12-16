import React from 'react';
import {View, StyleSheet} from 'react-native';
import RegisterForm from '../entities/auth/ui/RegisterForm.tsx';

const RegisterScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <RegisterForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RegisterScreen;
