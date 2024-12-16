import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {registerUser, setMessage} from '../model/authSlice.ts';
import {RootState} from 'app/providers/StoreProvider/config/store.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {AppNavigation} from 'shared/config/navigation';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const {loading, error, message} = authState;
  const navigation = useAppNavigation();

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      dispatch(setMessage('Введите все поля!'));
      return;
    }
    if (password !== confirmPassword) {
      dispatch(setMessage('Пароли не совпадают!'));
      return;
    }

    dispatch(registerUser({email, password, name: email}));
    navigation.navigate(AppNavigation.VERIFY);
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Ошибка',
        textBody: error,
      });
    }
    if (message) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Сообщение',
        textBody: message,
      });
    }
  }, [error, message]);

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

        {loading ? <Text style={styles.loadingText}>Loading...</Text> : null}

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
          onPress={() => navigation.navigate(AppNavigation.AUTH)}
          style={styles.existingAccountButton}
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
  loadingText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default RegisterForm;
