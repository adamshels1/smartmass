import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import i18n from 'shared/config/i18n';
import {useNavigation} from '@react-navigation/core';
import CustomText from 'shared/ui/CustomText/CustomText.tsx';

interface InformationSourcesButtonProps {}

const InformationSourcesButton: React.FC<
  InformationSourcesButtonProps
> = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      // @ts-ignore
      onPress={() => navigation.navigate('SourcesScreen')}>
      <CustomText style={styles.text}>
        {i18n.t('Information Sources')}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    marginTop: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 13,
    color: 'gray',
  },
});

export default InformationSourcesButton;
