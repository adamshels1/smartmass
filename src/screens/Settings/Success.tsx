import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import i18n from 'shared/config/i18n';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation';
import {AppNavigation} from 'shared/config/navigation';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';

export const Success = () => {
  const navigation = useAppNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.slide}>
        <Text style={styles.text}>
          {i18n.t('Поздравляем с успешной регистрацией!')}
        </Text>
        <LottieView
          style={{
            width: 300, // Adjust width for different animations
            height: 300, // Adjust height for different animations
            marginTop: 60, // Adjust margin for different animations
            marginBottom: 0, // Adjust margin for different animations
          }}
          source={require('shared/assets/animations/success.json')}
          autoPlay
          loop={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={i18n.t("Let's Get Started")}
          onPress={() => navigation.navigate(AppNavigation.HOME)}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    color: '#2c2c2c',
    width: '90%',
  },
  button: {flex: 1, marginLeft: 10},
});
