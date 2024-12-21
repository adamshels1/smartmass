import React from 'react';
import {SettingsMenu} from 'features/settings/ui/SettingsMenu.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const SettingsScreen: React.FC = () => {
  return (
    <AppLayout>
      <SettingsMenu />
    </AppLayout>
  );
};

export default SettingsScreen;
