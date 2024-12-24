import React from 'react';
import {Text, TextProps} from 'react-native';

const CustomText: React.FC<TextProps> = ({style, children, ...rest}) => {
  return (
    <Text
      style={[{color: '#000'}, style]} // Цвет по умолчанию черный
      {...rest}>
      {children}
    </Text>
  );
};

export default CustomText;
