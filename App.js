
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react';
import { store, persistor } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider >
  )
};


export default App;