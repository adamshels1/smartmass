import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import GoogleSigninButton2 from 'features/googleSignin/ui/GoogleSigninButton.tsx';
import {AppNavigation} from 'shared/config/navigation';
import {fetchAuth, loginWithEmail} from 'entities/auth/model/authSlice.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import {fetchUserDetails} from 'entities/userDetails/model/slices/userDetailsSlice.ts';
import {notificationInitialized} from 'entities/notification';
import i18n from 'i18next';
import {AppleSigninButton} from 'features/appleSignin/ui/AppleSigninButton.tsx';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: i18n.t('Ошибка'),
        textBody: i18n.t('Введите все поля!'),
      });
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(loginWithEmail({email, password})).unwrap();
      await AsyncStorage.setItem('userToken', result.token);
      await dispatch(fetchUserDetails());
      await dispatch(fetchAuth());
      await notificationInitialized();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: i18n.t('Вход'),
        textBody: i18n.t(`Вошли как: ${email}`, {email}),
      });
    } catch (err: any) {
      // Приведение err к типу any
      if (err.message === 'Please verify your email before logging in') {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: i18n.t('Ошибка'),
          textBody: i18n.t(err.message),
        });
        navigation.navigate(AppNavigation.VERIFY, {email, password});
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: i18n.t('Ошибка'),
          textBody: err.response.data.message,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: i18n.t('Ошибка'),
          textBody: err.message,
        });
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <CustomText style={styles.title}>{i18n.t('С возвращением')}</CustomText>
        <CustomText style={styles.subtitle}>
          {i18n.t('Войдите в ваш аккаунт')}
        </CustomText>

        <GoogleSigninButton2 />
        <AppleSigninButton />

        <CustomText style={styles.dividerText}>
          {i18n.t('Или войдите при помощи email аккаунта')}
        </CustomText>

        <CustomTextInput
          placeholder={i18n.t('Адрес электронной почты')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <CustomTextInput
          placeholder={i18n.t('Пароль')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? (
          <CustomText style={styles.errorText}>{error}</CustomText>
        ) : null}

        <TouchableOpacity
          onPress={() => navigation.navigate(AppNavigation.FORGOT)}>
          <CustomText style={styles.forgotPassword}>
            {i18n.t('Я забыл пароль')}
          </CustomText>
        </TouchableOpacity>

        <CustomButton
          title={i18n.t('Войти')}
          onPress={handleLogin}
          style={styles.loginButton}
          loading={loading}
        />
        <CustomButton
          title={i18n.t('Создать аккаунт')}
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
