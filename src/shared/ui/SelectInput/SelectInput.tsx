import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import RNPickerSelect, {PickerSelectProps} from 'react-native-picker-select';

interface SelectInputProps extends PickerSelectProps {
  label?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  value,
  onValueChange,
  items,
  placeholder,
  label,
  style,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          placeholder={placeholder}
          value={value}
          style={{
            inputAndroid: [styles.input, style?.inputAndroid],
            inputIOS: [styles.input, style?.inputIOS],
            iconContainer: styles.iconContainer,
          }}
          useNativeAndroidPickerStyle={false}
          {...rest}
        />
        <Image
          style={styles.inputIcon}
          source={require('shared/assets/icons/chevron-right.png')}
        />
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 33,
    position: 'relative',
    paddingHorizontal: 10,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  inputIcon: {
    width: 24,
    height: 24,
    top: 12,
    right: 15,
    position: 'absolute',
  },
  iconContainer: {
    top: 12,
    right: 15,
  },
});

export default SelectInput;
