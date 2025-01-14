import React, {useState} from 'react';
import {
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
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import i18n from 'i18next';

const RegisterForm = () => {
  const [name, setName] = useState(''); // Добавлен name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const {loading} = authState; // Добавлен isAuth
  const navigation = useAppNavigation();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      dispatch(setMessage(i18n.t('Введите все поля!')));
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: i18n.t('Сообщение'),
        textBody: i18n.t('Введите все поля!'),
      });
      return;
    }
    if (password !== confirmPassword) {
      dispatch(setMessage(i18n.t('Пароли не совпадают!')));
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: i18n.t('Сообщение'),
        textBody: i18n.t('Пароли не совпадают!'),
      });
      return;
    }

    try {
      const result = await dispatch(
        registerUser({email, password, name}),
      ).unwrap();
      console.log('Result:', result); // Логирование результата
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Успех',
        textBody: i18n.t('Регистрация прошла успешно'),
      });
      navigation.navigate(AppNavigation.VERIFY, {email, password});
    } catch (err: any) {
      console.error('Error:', err); // Логирование ошибки
      if (err.response && err.response.data && err.response.data.message) {
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
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <CustomText style={styles.title}>
          {i18n.t('Создание аккаунта')}
        </CustomText>
        <CustomText style={styles.subtitle}>
          {i18n.t('Создайте аккаунт чтобы')}
        </CustomText>

        <CustomTextInput
          placeholder={i18n.t('Ваше имя')}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
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
        <CustomTextInput
          placeholder={i18n.t('Пароль повторно')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {loading ? (
          <CustomText style={styles.loadingText}>
            {i18n.t('Загрузка...')}
          </CustomText>
        ) : null}

        <CustomText style={styles.acceptText}>
          {i18n.t('Нажимая кнопку зарегистрироваться вы принимаете')}{' '}
          <CustomText style={styles.termsText}>
            {i18n.t('Условия использования')}
          </CustomText>
        </CustomText>

        <CustomButton
          title={i18n.t('Зарегистрироваться')}
          onPress={handleRegister}
          style={styles.registerButton}
        />
        <CustomButton
          title={i18n.t('У меня уже есть аккаунт')}
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
