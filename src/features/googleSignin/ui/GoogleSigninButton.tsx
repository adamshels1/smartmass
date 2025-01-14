import React, {useState} from 'react';
import {View, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch';
import {fetchAuth, loginWithGoogle} from 'entities/auth/model/authSlice';
import {fetchUserDetails} from 'entities/userDetails/model/slices/userDetailsSlice.ts';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {notificationInitialized} from 'entities/notification';
import i18n from 'i18next';

GoogleSignin.configure({
  webClientId:
    '64664657407-dmp54n6k1cu108iks4uf58vopu9cpgka.apps.googleusercontent.com',
  iosClientId:
    '64664657407-i6pmfod2mmlfbhj6u2g1busns03fbru9.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const GoogleSigninButton2 = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);

      const idToken = userInfo?.data?.idToken;
      if (idToken) {
        await dispatch(loginWithGoogle(idToken));
        await dispatch(fetchUserDetails());
        await dispatch(fetchAuth());
        await notificationInitialized();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: i18n.t('Вход'),
          textBody: i18n.t('Вошли как: {{email}}', {
            email: userInfo?.data?.user?.email,
          }),
        });
      } else {
        console.error('No idToken returned from Google Sign-In');
      }
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Ошибка',
        textBody: error?.message.message || error?.message,
      });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Google Sign-In error', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          style={styles.googleButton}
          onPress={signIn}
        />
      )}
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
