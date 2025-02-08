import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PlayInstallReferrer} from 'react-native-play-install-referrer';
import branch from 'react-native-branch';

interface ReferralContextType {
  referralId: string | null;
}

const getRefFromURL = (url: string) => {
  const match = url.match(/[?&]ref=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const ReferralContext = createContext<ReferralContextType>({referralId: null});

export const ReferralProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [referralId, setReferralId] = useState<string | null>(null);

  useEffect(() => {
    branch.subscribe({
      onOpenComplete: ({params, error}) => {
        if (error) {
          Alert.alert('Error from Branch', JSON.stringify(error));
          console.error('Error from Branch: ' + error);
          return;
        }

        if (typeof params?.ref === 'string') {
          const ref: string = params.ref;
          Alert.alert(
            'Branch Referral',
            JSON.stringify(ref) || 'No referral found',
          );
          saveReferralToStorage(ref);
          setReferralId(ref);
        }
      },
    });

    const handleReferral = async (url: string) => {
      const ref = getRefFromURL(url);
      Alert.alert('Referral', ref || 'No referral found');
      if (ref) {
        await saveReferralToStorage(ref);
        setReferralId(ref);
      }
    };

    const checkInitialURL = async () => {
      const storedRef = await AsyncStorage.getItem('referralId');
      if (storedRef) {
        setReferralId(storedRef);
        return;
      }

      const url = await Linking.getInitialURL();
      Alert.alert('Initial URL', url || 'No initial URL found');
      if (url) {
        handleReferral(url);
      }
    };

    const listenForURLChanges = Linking.addEventListener('url', ({url}) =>
      handleReferral(url),
    );

    const fetchAndroidReferrer = async () => {
      if (Platform.OS === 'android') {
        try {
          PlayInstallReferrer.getInstallReferrerInfo((info, error) => {
            if (error) {
              Alert.alert(
                'PlayInstallReferrer Error',
                JSON.stringify(error.responseCode),
              );
              console.log('PlayInstallReferrer Error:', error);
              return;
            }
            if (info?.installReferrer) {
              Alert.alert(
                'PlayInstallReferrer Info',
                JSON.stringify(info.installReferrer),
              );
              saveReferralToStorage(info.installReferrer);
              setReferralId(info.installReferrer);
            }
          });
        } catch (e) {
          console.log('Failed to get install referrer', e);
        }
      }
    };

    checkInitialURL();
    fetchAndroidReferrer();

    return () => listenForURLChanges.remove();
  }, []);

  return (
    <ReferralContext.Provider value={{referralId}}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = (): string | null => {
  return useContext(ReferralContext).referralId;
};

const saveReferralToStorage = async (ref: string) => {
  try {
    await AsyncStorage.setItem('referralId', ref);
    console.log('Referral ID saved:', ref);
  } catch (e) {
    console.log('Error saving referral ID', e);
  }
};
