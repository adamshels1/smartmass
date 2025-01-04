import React, {useEffect, useState} from 'react';
import * as RNIap from 'react-native-iap';
import {Button, View} from 'react-native';
import {initIapConnection, subscribe} from 'shared/api/iap';
import {Subscription} from 'react-native-iap';

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    alert(2);
    const init = async () => {
      try {
        const subs = await initIapConnection();
        console.log('subs', subs);
        setSubscriptions(subs);
      } catch (err) {
        console.error(err);
      }
    };

    init();

    return () => {
      RNIap.endConnection();
    };
  }, []);

  const handleSubscribe = async (sku: string) => {
    const purchase = await subscribe(sku);
    if (purchase) {
      // Handle successful subscription
      console.log('Subscription successful:', purchase);
    } else {
      // Handle subscription failure
      console.error('Subscription failed');
    }
  };

  return (
    <View>
      {subscriptions.map(sub => (
        <Button
          key={sub.productId}
          title={`Subscribe to ${sub.title}`}
          onPress={() => handleSubscribe(sub.productId)}
        />
      ))}
    </View>
  );
};

export default SubscriptionManager;
