import React, {useRef} from 'react';
import {
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

interface InputProps {
  icon: ImageSourcePropType;
  style?: ViewStyle;
}

const Input: React.FC<InputProps> = ({icon, style, ...rest}) => {
  const textInputRef = useRef<TextInput>(null);

  return (
    <Pressable
      onPress={() => textInputRef.current?.focus()}
      style={[styles.inputContainer, style]}>
      <Image style={styles.inputIcon} source={icon} />
      <TextInput placeholderTextColor='#b5b5b5' ref={textInputRef} style={styles.input} {...rest} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 40,
    minHeight: 56,
    // Тень для Android
    elevation: 5,
    // Тень для iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
  },
  input: {
    margin: 10,
    fontSize: 14,
    flex: 1,
    color: '#3E423A'
  },
  inputIcon: {width: 24, height: 24, marginLeft: 5, marginRight: 5},
});

export default Input;
