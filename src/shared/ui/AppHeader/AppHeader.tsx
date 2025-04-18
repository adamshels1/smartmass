import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackIcon} from 'shared/assets/icons';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

interface Props {
  title?: string;
  showBackButton?: boolean;
}

export const AppHeader = ({title, showBackButton = true}: Props) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
      )}
      <CustomText style={styles.title} numberOfLines={1}>
        {title}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'normal',
    marginLeft: 16,
    width: '70%',
  },
  backButton: {
    padding: 8,
  },
});
