import React from 'react';
import {Image, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';

interface CheckboxProps {
  value: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const Checkbox: React.FC<CheckboxProps> = ({value, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={
          value
            ? require('assets/icons/checklist.png')
            : require('assets/icons/eclipse.png')
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 25,
    height: 25,
    marginTop: 2,
    marginRight: 7,
  },
});

export default Checkbox;
