import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppStatusBar} from 'shared/ui/AppStatusBar';
import {Navigation} from './navigation';
import {StoreProvider} from './providers/StoreProvider';
import {LanguageProvider} from 'app/providers/LanguageProvider';
import {PaperProvider} from 'react-native-paper';
import {AlertNotificationRoot} from 'react-native-alert-notification';

const App = (): React.JSX.Element => {
  return (
    <StoreProvider>
      <LanguageProvider>
        <PaperProvider>
          <AlertNotificationRoot>
            <SafeAreaProvider>
              <AppStatusBar />
              <Navigation />
            </SafeAreaProvider>
          </AlertNotificationRoot>
        </PaperProvider>
      </LanguageProvider>
    </StoreProvider>
  );
};

export default App;
