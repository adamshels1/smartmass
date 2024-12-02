import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, SafeAreaView} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import Chat from 'features/chat/ui/Chat';
import GoogleSigninButton2 from 'features/googleSignin/ui/GoogleSigninButton';

export default function ChatScreen({navigation}) {
  const userData = useSelector(state => state.userData);

  useEffect(() => {
    const getDeviceId = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      analytics().setUserId(deviceId);
    };

    getDeviceId();
    analytics().logEvent('screen_view', {screen_name: 'Home'});

    return () => {};
  }, []);

  const isHasSettingsData =
    userData.weight && userData.height && userData.goal && userData.allergies;

  useEffect(() => {
    if (!isHasSettingsData) {
      navigation.navigate('SettingsScreen');
    }
  }, [isHasSettingsData, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <GoogleSigninButton2 />
      <Chat />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
