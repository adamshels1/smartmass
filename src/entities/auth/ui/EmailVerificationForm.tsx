import React, {useState, useEffect, useRef, RefObject} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';

const EmailVerificationForm: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(49);
  const inputsRef: RefObject<TextInput>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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
      Alert.alert('Ошибка', 'Введите полный код');
      return;
    }
    Alert.alert('Успех', 'Email успешно подтверждён');
  };

  const handleResendCode = () => {
    Alert.alert('Код отправлен повторно');
    setTimer(49);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Подтвердите Email</Text>
        <Text style={styles.subtitle}>
          Мы отправили код вам на почту. Введите его в поле ниже чтобы
          подтвердить ваш аккаунт
        </Text>
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
          title="Подтвердить"
          onPress={() => handleVerify(code)}
          style={styles.verifyButton}
        />
        <Text style={styles.infoText}>
          Не пришла почта? Проверьте папку спам или{' '}
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Отправить повторно через {timer} сек
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Отправить повторно</Text>
            </TouchableOpacity>
          )}
        </Text>
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
