import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import EmailVerificationForm from 'features/Auth/components/EmailVerificationForm.tsx';

const EmailVerificationScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <EmailVerificationForm />
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

export default EmailVerificationScreen;
