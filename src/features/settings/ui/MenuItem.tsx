import React from 'react';
import {Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation.ts';
import {AppNavigation} from 'shared/config/navigation';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

interface MenuItemProps {
  title: string;
  navigationTarget: any; // Update this to match your navigation enum type
}

const MenuItem: React.FC<MenuItemProps> = ({title, navigationTarget}) => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(navigationTarget)}
      style={styles.sectionItem}>
      <CustomText style={styles.sectionItemText}>{title}</CustomText>
      <Image
        style={styles.inputIcon}
        source={require('assets/icons/chevron-right.png')}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sectionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionItemText: {
    fontSize: 15,
  },
  inputIcon: {
    width: 24,
    height: 24,
  },
});

export default MenuItem;
