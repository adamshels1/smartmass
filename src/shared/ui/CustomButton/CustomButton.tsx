import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text
          style={[
            styles.buttonText,
            textStyle,
            disabled && styles.disabledButtonText,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#31D6D6',
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: '#A5A5A5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  disabledButtonText: {
    color: '#D1D1D1',
  },
});

export default CustomButton;
