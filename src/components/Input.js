import React, { useRef } from 'react';
import { TextInput, Image, StyleSheet, Pressable } from 'react-native';

const Input = (props) => {
  const textInputRef = useRef(null);

  return (
    <Pressable onPress={() => textInputRef.current.focus()} style={styles.inputContainer}>
      <Image style={styles.inputIcon} source={props.icon} />
      <TextInput
        ref={textInputRef}
        style={styles.input}
        {...props}
      />
    </Pressable>
  );
};

export default Input;


const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
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
    width: 250
  },
  input: {

    margin: 10,
    fontSize: 14,
  },
  inputIcon: { width: 24, height: 24, marginLeft: 5, marginRight: 5 }
});