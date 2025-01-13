import React, {useState, useRef, RefObject} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider/config/store.ts';
import {
  verifyEmailCode,
  loginWithEmail,
  fetchAuth,
} from 'entities/auth/model/authSlice.ts'; // Импортируем действие
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';
import {Toast, ALERT_TYPE} from 'react-native-alert-notification';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import {useAppRoute} from 'shared/lib/navigation/useAppRoute.ts';
import {AppNavigation} from 'shared/config/navigation';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';
import i18n from 'i18next';

const EmailVerificationForm: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(49);
  const inputsRef: RefObject<TextInput>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const dispatch = useAppDispatch();
  const {loading, message} = useSelector((state: RootState) => state.auth);
  const route = useAppRoute<AppNavigation.VERIFY>();
  const email = route.params?.email || '';
  const password = route.params?.password || '';
  const navigation = useAppNavigation();

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    } // Ensure single digit input
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 3) {
      inputsRef[index + 1]?.current?.focus();
    }
    if (index === 3 && text) {
      handleVerify(newCode);
    }
  };

  const handleKeyPress = (e: {nativeEvent: {key: string}}, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
      inputsRef[index - 1]?.current?.focus();
    }
  };

  const handleVerify = (newCode: string[]) => {
    if (newCode.join('').length < 4) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: i18n.t('Сообщение'),
        textBody: i18n.t('Введите все поля!'),
      });
      return;
    }
    dispatch(verifyEmailCode({email, code: newCode.join('')}))
      .unwrap()
      .then(async () => {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: i18n.t('Подтверждение Email'),
          textBody: i18n.t('Ваш email успешно подтвержден!'),
        });
        // await sleep(2000);
        // Автоматическая авторизация после успешной верификации
        await dispatch(loginWithEmail({email, password}))
          .unwrap()
          .then(async () => {
            await dispatch(fetchAuth());
            navigation.navigate(AppNavigation.SETTINGS_STEPS); // Замените 'Home' на название экрана после авторизации
          })
          .catch((error: any) => {
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: i18n.t('Ошибка авторизации'),
              textBody: error || i18n.t('Неизвестная ошибка'),
            });
          });
      })
      .catch((error: any) => {
        console.log('error', error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: i18n.t('Ошибка'),
          textBody: error || i18n.t('Неизвестная ошибка'),
        });
      });
  };

  const handleResendCode = () => {
    Toast.show({
      type: ALERT_TYPE.INFO,
      title: i18n.t('Сообщение'),
      textBody: i18n.t('Код отправлен повторно'),
    });
    setTimer(49);
  };

  // Таймер
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // React.useEffect(() => {
  //   if (message) {
  //     Toast.show({
  //       type: ALERT_TYPE.SUCCESS,
  //       title: 'Сообщение',
  //       textBody: message,
  //     });
  //   }
  // }, [message]);

  return (
    <>
      <AppHeader title={i18n.t('E-mail подтверждение')} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <CustomText style={styles.title}>
            {i18n.t('Подтвердите Email')}
          </CustomText>
          <CustomText style={styles.subtitle}>
            {i18n.t(
              'Мы отправили код вам на почту. Введите его в поле ниже чтобы подтвердить ваш аккаунт',
            )}
          </CustomText>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputsRef[index]}
                style={styles.codeInput}
                value={digit}
                onChangeText={text => handleChangeText(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>
          <CustomButton
            title={i18n.t('Подтвердить')}
            onPress={() => handleVerify(code)}
            style={styles.verifyButton}
            disabled={loading}
          />
          <CustomText style={styles.infoText}>
            {i18n.t('Не пришла почта? Проверьте папку спам или')}{' '}
            {timer > 0 ? (
              <CustomText style={styles.timerText}>
                {i18n.t('Отправить повторно через {timer} сек', {timer})}
              </CustomText>
            ) : (
              <TouchableOpacity onPress={handleResendCode}>
                <CustomText style={styles.resendText}>
                  {i18n.t('Отправить повторно')}
                </CustomText>
              </TouchableOpacity>
            )}
          </CustomText>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5, // Добавляем отступы между ячейками
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#31D6D6',
    width: '100%', // Увеличиваем ширину кнопки
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 20,
  },
  timerText: {
    color: '#888',
  },
  resendText: {
    color: '#1e90ff',
  },
});

export default EmailVerificationForm;
