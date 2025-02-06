import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';

interface ReferralContextType {
  referralId: string | null;
}

const ReferralContext = createContext<ReferralContextType>({referralId: null});

export const ReferralProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [referralId, setReferralId] = useState<string | null>(null);

  useEffect(() => {
    const handleReferral = (url: string) => {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const ref = urlParams.get('ref');
      Alert.alert('ref', JSON.stringify(ref));
      if (ref) {
        setReferralId(ref);
        saveReferralToDatabase(ref);
      }
    };

    // Получаем URL, если приложение было открыто через ссылку
    Linking.getInitialURL().then(url => {
      Alert.alert('url', JSON.stringify(url));
      if (url) {
        handleReferral(url);
      }
    });

    // Добавляем обработчик для новых ссылок
    const listener = Linking.addEventListener('url', ({url}) =>
      handleReferral(url),
    );

    return () => listener.remove();
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

const saveReferralToDatabase = (ref: string) => {
  // Здесь логика сохранения реферального ID в БД
  console.log('Saving referral ID:', ref);
};
