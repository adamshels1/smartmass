import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setError('Введите все поля!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают!');
      return;
    }

    // Пример обработки регистрации
    setError('');
    Alert.alert('Регистрация', `Зарегистрированы как: ${email}`);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Создание аккаунта</Text>
        <Text style={styles.subtitle}>Создайте аккаунт чтобы</Text>

        <CustomTextInput
          placeholder="Адрес электронной почты"
          value={email}
          onChangeText={setEmail}
        />
        <CustomTextInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CustomTextInput
          placeholder="Пароль повторно"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.acceptText}>
          Нажимая кнопку зарегистрироваться вы принимаете{' '}
          <Text style={styles.termsText}>Условия использования</Text>
        </Text>

        <CustomButton
          title="Зарегистрироваться"
          onPress={handleRegister}
          style={styles.registerButton}
        />
        <CustomButton
          title="У меня уже есть аккаунт"
          onPress={() => Alert.alert('Уже есть аккаунт')}
          style={[styles.registerButton, styles.existingAccountButton]}
          textStyle={styles.existingAccountButtonText}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  acceptText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 20,
  },
  termsText: {
    color: '#1e90ff',
  },
  registerButton: {
    backgroundColor: '#31D6D6',
  },
  existingAccountButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#31D6D6',
  },
  existingAccountButtonText: {
    color: '#31D6D6',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default RegisterForm;
