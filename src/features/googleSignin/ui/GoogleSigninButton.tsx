import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch';
import {loginWithGoogle} from 'entities/auth/model/authSlice';

GoogleSignin.configure({
  webClientId:
    '64664657407-dmp54n6k1cu108iks4uf58vopu9cpgka.apps.googleusercontent.com',
  iosClientId:
    '64664657407-i6pmfod2mmlfbhj6u2g1busns03fbru9.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const GoogleSigninButton2 = () => {
  const dispatch = useAppDispatch();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Alert.alert('User Info', JSON.stringify(userInfo));
      console.log('userInfo', userInfo);

      const idToken = userInfo?.data?.idToken;
      if (idToken) {
        dispatch(loginWithGoogle(idToken));
      } else {
        console.error('No idToken returned from Google Sign-In');
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In error', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Google Sign-In error', error);
      }
    }
  };

  return (
    <View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        style={styles.googleButton}
        onPress={signIn}
      />
    </View>
  );
};

export default GoogleSigninButton2;

const styles = StyleSheet.create({
  googleButton: {
    width: '100%',
    height: 48,
  },
});
