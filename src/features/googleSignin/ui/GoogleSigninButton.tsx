import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch';
import {loginWithGoogle} from 'entities/auth/model/authSlice'; // Импортируем функцию

GoogleSignin.configure({
  webClientId:
    '159826741921-tovc2e47hpc40u438hr0iramltmq5n91.apps.googleusercontent.com',
  iosClientId:
    '159826741921-a2bu9lao58e8cc93nffoqvdt2j2pcfqb.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const GoogleSigninButton2 = () => {
  const dispatch = useAppDispatch();

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
      // @ts-ignore
      const {idToken} = userInfo.data;
      dispatch(loginWithGoogle(idToken));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <GoogleSigninButton
        size={1}
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
    borderRadius: 3,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
