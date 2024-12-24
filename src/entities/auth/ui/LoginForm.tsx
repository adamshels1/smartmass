import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import GoogleSigninButton2 from 'features/googleSignin/ui/GoogleSigninButton.tsx';
import {AppNavigation} from 'shared/config/navigation';
import {loginWithEmail} from 'entities/auth/model/authSlice.ts';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Ошибка',
        textBody: 'Введите все поля!',
      });
      return;
    }

    try {
      const result = await dispatch(loginWithEmail({email, password})).unwrap();
      await AsyncStorage.setItem('userToken', result.token);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Вход',
        textBody: `Вошли как: ${email}`,
      });
    } catch (err: any) {
      // Приведение err к типу any
      if (err.response && err.response.data && err.response.data.message) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Ошибка',
          textBody: err.response.data.message,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Ошибка',
          textBody: err.message,
        });
      }
      setError(err.message);
    }
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>С возвращением</Text>
          <Text style={styles.subtitle}>Войдите в ваш аккаунт</Text>

          <GoogleSigninButton2 />

          <Text style={styles.dividerText}>
            Или войдите при помощи email аккаунта
          </Text>

          <CustomTextInput
            placeholder="Адрес электронной почты"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomTextInput
            placeholder="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Я забыл пароль</Text>
          </TouchableOpacity>

          <CustomButton
            title="Войти"
            onPress={handleLogin}
            style={styles.loginButton}
          />
          <CustomButton
            title="Создать аккаунт"
            onPress={() => navigation.navigate(AppNavigation.REGISTRATION)}
            style={styles.registerButton}
            textStyle={styles.registerButtonText}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
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
  dividerText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 20,
  },
  forgotPassword: {
    color: '#31D6D6',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#31D6D6',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#31D6D6',
  },
  registerButtonText: {
    color: '#31D6D6',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default SignInScreen;
