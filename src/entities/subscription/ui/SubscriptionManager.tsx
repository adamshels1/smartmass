import React, {useEffect, useState} from 'react';
import * as RNIap from 'react-native-iap';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {initIapConnection, subscribe} from 'shared/api/iap';
import {Subscription} from 'react-native-iap';
import CustomButton from 'shared/ui/CustomButton/CustomButton.tsx';
import {SkeletonLoader} from 'shared/ui';

const subscriptionIds = ['com.adamshels.smartmass.sku'];

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initIapConnection();

        const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
          purchase => {
            console.log('Purchase Updated:', purchase);
          },
        );

        const purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
          console.error('Purchase Error:', error);
        });

        const subs = await RNIap.getSubscriptions({skus: subscriptionIds});
        console.log('Received subscriptions:', subs);
        setSubscriptions(subs);
      } catch (err) {
        console.error('Error initializing IAP connection:', err);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      RNIap.endConnection();
    };
  }, []);

  const handleSubscribe = async (sku: string) => {
    try {
      const purchase = await subscribe(sku);
      if (purchase) {
        console.log('Subscription successful:', purchase);
      } else {
        console.error('Failed to subscribe');
      }
    } catch (err) {
      console.error('Error subscribing:', err);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subscriptions}
        keyExtractor={item => item.productId}
        renderItem={({item}) => (
          <View style={styles.subscriptionItem}>
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionTitle}>{item.title}</Text>
              <Text style={styles.subscriptionPrice}>$4.99 / month</Text>
              <Text style={styles.subscriptionTrial}>
                7-day free trial period
              </Text>
            </View>
            <CustomButton
              style={{width: 100}}
              title="Subscribe"
              onPress={() => handleSubscribe(item.productId)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subscriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  subscriptionDetails: {
    flex: 1,
    marginRight: 16,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionPrice: {
    fontSize: 16,
    color: '#555',
  },
  subscriptionTrial: {
    marginTop: 3,
    fontSize: 14,
    color: '#777',
  },
});

export default SubscriptionManager;
