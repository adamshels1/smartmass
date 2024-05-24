import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import LottieView from 'lottie-react-native';
import Button from '../components/Button';

const WelcomeScreen = ({navigation}) => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      text: 'Получайте рацион питания быстро и удобно благодаря Искусственному Интеллекту.',
      animation: require('../assets/animations/Animation - 1716491891171.json'),
    },
    {
      text: 'Запланируйте уведомления, чтобы всегда принимать пищу вовремя и без лишних хлопот.',
      animation: require('../assets/animations/Animation - 1716487145324.json'),
    },
    {
      text: 'Легко подсчитывайте содержимое корзины продуктов с помощью нашего приложения.',
      animation: require('../assets/animations/Animation - 1716491430846.json'),
    },
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1, true); // true for animated
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(-1, true); // true for animated
    }
  };

  const handleFinish = () => {
    // Your logic for finish action
    navigation.navigate('ChatScreen');
  };

  const renderButton = () => {
    if (currentIndex === slides.length - 1) {
      return (
        <Button
          title={'Давай начнем'}
          onPress={handleFinish}
          style={{flex: 1, marginLeft: 10}}
        />
      );
    } else {
      return (
        <Button
          title={'Далее'}
          onPress={handleNext}
          style={{flex: 1, marginLeft: 10}}
        />
      );
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 20,
        }}>
        {renderButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default WelcomeScreen;
