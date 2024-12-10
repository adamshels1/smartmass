import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppStatusBar} from 'shared/ui/AppStatusBar';
import {Navigation} from './navigation';
import {StoreProvider} from './providers/StoreProvider';
import {PaperProvider} from 'react-native-paper';

const App = (): React.JSX.Element => {
  return (
    <StoreProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <AppStatusBar />
          <Navigation />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
