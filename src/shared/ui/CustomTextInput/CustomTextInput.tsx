import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

interface CustomTextInputProps {
  value: string | undefined;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  label?: string;
  labelStyle?: TextStyle;
  secureTextEntry?: boolean; // Для ввода пароля
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'; // Тип клавиатуры
  maxLength?: number; // Максимальная длина ввода
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; // Новый пропс для автокапитализации
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  label,
  labelStyle,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  autoCapitalize = 'none', // Значение по умолчанию для автокапитализации
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); // По умолчанию видимость соответствует secureTextEntry

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={'gray'}
          secureTextEntry={!isPasswordVisible} // Управляем видимостью текста
          style={[styles.input, inputStyle]}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize} // Добавляем пропс автокапитализации
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prev => !prev)}
            style={styles.boxContainer}>
            <View style={styles.box} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 33,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  boxContainer: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    backgroundColor: '#ccc', // Цвет квадрата
    borderRadius: 4, // Закругление углов (можно убрать)
  },
});

export default CustomTextInput;
