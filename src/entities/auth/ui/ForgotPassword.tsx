import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import CustomTextInput from 'shared/ui/CustomTextInput/CustomTextInput.tsx';
import {AppNavigation} from 'shared/config/navigation';
import {forgotPasswordThunk} from 'entities/auth/model/authSlice.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Ошибка',
        textBody: 'Введите ваш email!',
      });
      return;
    }

    try {
      setLoading(true);
      await dispatch(forgotPasswordThunk({email})).unwrap();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Сброс пароля',
        textBody: `Инструкции по сбросу отправлены на: ${email}`,
      });
      navigation.navigate(AppNavigation.AUTH); // Перенаправление на экран входа
    } catch (err: any) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Ошибка',
        textBody: err || 'Что-то пошло не так',
      });
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
        <CustomText style={styles.title}>Сброс пароля</CustomText>
        <CustomText style={styles.subtitle}>
          Введите ваш email для сброса пароля
        </CustomText>

        <CustomTextInput
          placeholder="Адрес электронной почты"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {error ? (
          <CustomText style={styles.errorText}>{error}</CustomText>
        ) : null}

        <CustomButton
          title="Отправить"
          onPress={handleForgotPassword}
          style={styles.forgotPasswordButton}
          loading={loading}
        />
        <CustomButton
          title="Вернуться к входу"
          onPress={() => navigation.navigate(AppNavigation.AUTH)}
          style={styles.backToSignInButton}
          textStyle={styles.backToSignInButtonText}
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
  forgotPasswordButton: {
    backgroundColor: '#31D6D6',
  },
  backToSignInButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#31D6D6',
    marginTop: 10,
  },
  backToSignInButtonText: {
    color: '#31D6D6',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ForgotPasswordScreen;
