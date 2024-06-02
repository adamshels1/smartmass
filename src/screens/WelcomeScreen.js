import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import Button from '../components/Button';
import LottieView from 'lottie-react-native';
import {setShowWelcomeScreen} from '../store/userActions';
import {useDispatch} from 'react-redux';
import i18n from '../shared/config/i18n';

const MySwiper = ({navigation}) => {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      text: i18n.t(
        'Get your meal plan quickly and conveniently with Artificial Intelligence.',
      ),
      animation: require('../assets/animations/Animation - 1716491891171.json'),
    },
    {
      text: i18n.t('Plan notifications to always eat on time and hassle-free.'),
      animation: require('../assets/animations/Animation - 1716487145324.json'),
    },
    {
      text: i18n.t(
        'Easily track the contents of your grocery basket with our app.',
      ),
      animation: require('../assets/animations/Animation - 1716491430846.json'),
    },
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1, true);
    }
  };

  const handleFinish = () => {
    navigation.navigate('SettingsScreen');
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
          <Button
            title={i18n.t('Next')}
            onPress={handleNext}
            style={{flex: 1, marginLeft: 10}}
          />
        ) : (
          <Button
            title={i18n.t("Let's Get Started")}
            onPress={handleFinish}
            style={{flex: 1, marginLeft: 10}}
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
});

export default MySwiper;
