import React from 'react';
import {View, StyleSheet} from 'react-native';
import EmailVerificationForm from 'entities/auth/ui/EmailVerificationForm.tsx';

const EmailVerificationScreen: React.FC = () => {
  return (
    <View style={styles.container}>
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
