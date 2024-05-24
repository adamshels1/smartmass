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
          <Tooltip
            animated={true}
            // (Optional) When true,
            // tooltip will animate in/out when showing/hiding
            arrowSize={{width: 16, height: 8}}
            // (Optional) Dimensions of arrow bubble pointing
            // to the highlighted element
            backgroundColor="rgba(0,0,0,0.5)"
            // (Optional) Color of the fullscreen background
            // beneath the tooltip.
            isVisible={tooltipStep === 'showCartButton'}
            // (Must) When true, tooltip is displayed
            content={
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#505050',
                    fontWeight: '300',
                  }}>
                  Корзина продуктов для рациона
                </Text>
              </View>
            }
            // (Must) This is the view displayed in the tooltip
            placement="bottom"
            // (Must) top, bottom, left, right, auto.
            onClose={() => dispatch(setTooltipStep(''))}
            // (Optional) Callback fired when the user taps the tooltip
          >
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => navigation.navigate('CartScreen')}>
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
