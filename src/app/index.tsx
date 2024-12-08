import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppStatusBar} from 'shared/ui/AppStatusBar';
import {Navigation} from './navigation';
import {StoreProvider} from './providers/StoreProvider';

const App = (): React.JSX.Element => {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <AppStatusBar />
        <Navigation />
      </SafeAreaProvider>
    </StoreProvider>
  );
};

export default App;
