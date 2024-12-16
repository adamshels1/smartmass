import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx'; // Используем ваш компонент
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import {AppNavigation} from 'shared/config/navigation';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import GoogleSigninButton2 from 'features/googleSignin/ui/GoogleSigninButton.tsx'; // Используем ваш компонент

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useAppNavigation();

  const handleLogin = () => {
    if (!email || !password) {
      setError('Введите все поля!');
      return;
    }

    // Пример обработки авторизации
    setError('');
    Alert.alert('Вход', `Вошли как: ${email}`);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>С возвращением</Text>
        <Text style={styles.subtitle}>Войдите в ваш аккаунт</Text>

        {/*<TouchableOpacity style={styles.appleButton}>*/}
        {/*  <Text style={styles.appleText}>*/}
        {/*     Войти при помощи аккаунта Apple*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}

        <GoogleSigninButton2 />

        <Text style={styles.dividerText}>
          Или войдите при помощи email аккаунта
        </Text>

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
  appleButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 33,
    alignItems: 'center',
    marginBottom: 10,
  },
  appleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
