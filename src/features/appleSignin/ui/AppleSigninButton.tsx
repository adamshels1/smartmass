import React from 'react';
import {View} from 'react-native';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {fetchAuth, loginWithApple} from 'entities/auth/model/authSlice.ts';
import {fetchUserDetails} from 'entities/userDetails/model/slices/userDetailsSlice.ts';
import {notificationInitialized} from 'entities/notification';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import i18n from 'i18next';
import {useAppDispatch} from 'shared/lib/state/dispatch/useAppDispatch.ts';

export const AppleSigninButton = () => {
  const dispatch = useAppDispatch();
  const signInWithApple = async () => {
    try {
      // Выполняем вход
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {user, email, fullName, identityToken} = appleAuthRequestResponse;
      const name = fullName?.givenName
        ? fullName?.givenName + ' ' + fullName?.familyName
        : 'Apple Account';

      if (identityToken) {
        await dispatch(
          loginWithApple({
            name,
            idToken: identityToken,
          }),
        );
        await dispatch(fetchUserDetails());
        await dispatch(fetchAuth());
        await notificationInitialized();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: i18n.t('Вход'),
          textBody: i18n.t('Вошли как: {{email}}', {
            email: email || name,
          }),
        });
      } else {
        console.error('No idToken returned from Google Sign-In');
      }
    } catch (error: any) {
      if (error && error.code !== '1001') {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Ошибка',
          textBody: error?.message.message || error?.message,
        });
        console.error(error);
      }
    }
  };

  return (
    <View>
      {/* Кнопка Sign in with Apple */}
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: '100%',
          height: 44,
          marginTop: 10,
        }}
        onPress={signInWithApple}
      />
    </View>
  );
};
