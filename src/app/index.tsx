import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppStatusBar} from 'shared/ui/AppStatusBar';
import {Navigation} from './navigation';
import {StoreProvider} from './providers/StoreProvider';
import {LanguageProvider} from 'app/providers/LanguageProvider';
import {PaperProvider} from 'react-native-paper';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import {NotificationProvider} from 'app/providers/NotificationProvider';
import {ReferralProvider} from 'app/providers/ReferralProvider';

const App = (): React.JSX.Element => {
  return (
    <StoreProvider>
      <ReferralProvider>
        <LanguageProvider>
          <PaperProvider>
            <NotificationProvider>
              <AlertNotificationRoot>
                <SafeAreaProvider>
                  <AppStatusBar />
                  <Navigation />
                </SafeAreaProvider>
              </AlertNotificationRoot>
            </NotificationProvider>
          </PaperProvider>
        </LanguageProvider>
      </ReferralProvider>
    </StoreProvider>
  );
};

export default App;
