import * as RNIap from 'react-native-iap';
import {
  requestSubscription,
  getSubscriptions,
  Subscription,
  SubscriptionPurchase,
} from 'react-native-iap';

const itemSkus = ['com.adamshels.smartmass.sku'];

export const initIapConnection = async (): Promise<Subscription[]> => {
  try {
    await RNIap.initConnection();
    const subscriptions = await getSubscriptions({skus: itemSkus});
    console.log('subscriptions', subscriptions);
    return subscriptions;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const subscribe = async (
  sku: string,
): Promise<SubscriptionPurchase | null> => {
  try {
    const purchase = await requestSubscription({sku});
    return purchase as SubscriptionPurchase;
  } catch (err) {
    console.error(err);
    return null;
  }
};
