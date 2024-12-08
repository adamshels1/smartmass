import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from '../config/store';
import {View, ActivityIndicator} from 'react-native';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({children}) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View>
            <ActivityIndicator />
          </View>
        }
        persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
