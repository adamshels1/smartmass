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
import {setTooltipStep} from '../store/userActions.js';
import Tooltip from 'react-native-walkthrough-tooltip';
import {useDispatch, useSelector} from 'react-redux';
import i18n from '../shared/config/i18n';

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
  const dispatch = useDispatch();
  const tooltipStep = useSelector(state => state.userData.tooltipStep);
  return (
    <View style={[styles.container, containerStyle]}>
      {showBack ? (
        <TouchableOpacity onPress={navigation.goBack} hitSlop={20}>
          <Image
            style={styles.icon}
            source={require('../assets/icons/back.png')}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <Text style={[styles.title, titleStyle]}>{i18n.t(title)}</Text>

      <View style={{flexDirection: 'row'}}>
        {showSettingsIcon ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingsScreen')}
            hitSlop={10}>
            <Image
              style={styles.icon}
              source={require('../assets/icons/settings.png')}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {showSettingsIcon ? (
          <Tooltip
            arrowSize={{width: 16, height: 8}}
            backgroundColor="rgba(0,0,0,0.5)"
            isVisible={tooltipStep === 'showCartButton'}
            content={
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#505050',
                    fontWeight: '300',
                  }}>
                  {i18n.t('Cart for the diet')}
                </Text>
              </View>
            }
            placement="bottom"
            onClose={() => dispatch(setTooltipStep(''))}>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => navigation.navigate('CartScreen')}
              hitSlop={10}>
              <Image
                style={styles.icon}
                source={require('../assets/icons/cart_inactive.png')}
              />
            </TouchableOpacity>
          </Tooltip>
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
