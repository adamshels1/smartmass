import React from 'react';
import SettingsSteps from 'features/settings/ui/SettingsSteps.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const SettingsStepsScreen: React.FC = () => {
  return (
    <AppLayout>
      <SettingsSteps />
    </AppLayout>
  );
};

export default SettingsStepsScreen;
