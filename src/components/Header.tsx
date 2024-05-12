import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface HeaderProps {
  title: string;
  navigation: any; // Замените тип на конкретный тип навигации, если возможно
  showBack?: boolean;
  showSettingsIcon?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const Header: React.FC<HeaderProps> = ({
  title,
  navigation,
  showBack = true,
  showSettingsIcon,
  containerStyle,
  titleStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {showBack ? (
        <TouchableOpacity onPress={navigation.goBack}>
          <Image
            style={styles.icon}
            source={require('../assets/icons/back.png')}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <Text style={[styles.title, titleStyle]}>{title}</Text>

      <View style={{flexDirection: 'row'}}>
        {showSettingsIcon ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingsScreen')}>
            <Image
              style={styles.icon}
              source={require('../assets/icons/settings.png')}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {showSettingsIcon ? (
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => navigation.navigate('CartScreen')}>
            <Image
              style={styles.icon}
              source={require('../assets/icons/cart_inactive.png')}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 35,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    color: '#3E423A',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Header;
