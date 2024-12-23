import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import LottieView from 'lottie-react-native';
import {setShowWelcomeScreen} from 'entities/auth/model/authSlice';
import i18n from 'shared/config/i18n';
import {useAppNavigation} from 'shared/lib/navigation/useAppNavigation';
import {AppNavigation} from 'shared/config/navigation';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';

export const Welcome = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const swiperRef = useRef<Swiper>(null); // Specify the type here
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      text: i18n.t(
        'Get your meal plan quickly and conveniently with Artificial Intelligence.',
      ),
      animation: require('shared/assets/animations/1716491891171.json'),
    },
    {
      text: i18n.t('Plan notifications to always eat on time and hassle-free.'),
      animation: require('shared/assets/animations/1716487145324.json'),
    },
    {
      text: i18n.t(
        'Easily track the contents of your grocery basket with our app.',
      ),
      animation: require('shared/assets/animations/1716491430846.json'),
    },
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1, true);
    }
  };

  const handleFinish = () => {
    navigation.navigate(AppNavigation.AUTH);
    dispatch(setShowWelcomeScreen(false));
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        loop={false}
        showsButtons={false}
        activeDotColor="#67CFCF"
        onIndexChanged={index => setCurrentIndex(index)}>
        {slides.map((slide, index) => (
          <View style={styles.slide} key={index}>
            <Text style={styles.text}>{slide.text}</Text>
            <LottieView
              style={{
                width: index === 0 ? 200 : 300, // Adjust width for different animations
                height: index === 0 ? 200 : 300, // Adjust height for different animations
                marginTop: index === 2 ? 30 : 60, // Adjust margin for different animations
                marginBottom: index === 0 ? 70 : 0, // Adjust margin for different animations
              }}
              source={slide.animation}
              autoPlay
              loop
            />
          </View>
        ))}
      </Swiper>
      <View style={styles.buttonContainer}>
        {currentIndex < slides.length - 1 ? (
          <CustomButton
            title={i18n.t('Next')}
            onPress={handleNext}
            style={styles.button}
          />
        ) : (
          <CustomButton
            title={i18n.t("Let's Get Started")}
            onPress={handleFinish}
            style={styles.button}
          />
        )}
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

  wrapper: {
    backgroundColor: '#31D6D6', // Устанавливаем цвет фона слайдера
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
    color: '#67CFCF',
    width: '90%',
  },
  button: {flex: 1, marginLeft: 10},
});
