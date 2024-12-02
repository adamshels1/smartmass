import React, {useEffect} from 'react';
import {View} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId:
    '159826741921-tovc2e47hpc40u438hr0iramltmq5n91.apps.googleusercontent.com',
  iosClientId:
    '159826741921-a2bu9lao58e8cc93nffoqvdt2j2pcfqb.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const GoogleSigninButton2 = () => {
  useEffect(() => {
    GoogleSignin.signInSilently()
      .then(user => {
        console.log(user);
      })
      .catch(error => {
        if (error.code !== statusCodes.SIGN_IN_REQUIRED) {
          console.error(error);
        }
      });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken, user} = userInfo.data;
      const {email, name, photo} = user;

      // Отправка данных на ваш бэкэнд
      const response = await fetch('http://localhost:3000/api/googleAuth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({idToken, email, name, photo}),
      });
      console.log('response', response);
      alert(JSON.stringify(response));

      const data = await response.json();
      await AsyncStorage.setItem('userToken', data.token);

      console.log(userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <GoogleSigninButton onPress={signIn} />
    </View>
  );
};

export default GoogleSigninButton2;
