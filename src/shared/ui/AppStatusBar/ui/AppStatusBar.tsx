import {StatusBar} from 'react-native';

export const AppStatusBar = () => {
  return (
    <StatusBar
      barStyle={'dark-content'} // Белый текст и иконки
      backgroundColor={'transparent'}
      translucent
    />
  );
};
