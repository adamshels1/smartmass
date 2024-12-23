import React from 'react';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import {Welcome} from 'features/welcome/ui/Welcome.tsx';

const WelcomeScreen: React.FC = () => {
  return (
    <AppLayout>
      <Welcome />
    </AppLayout>
  );
};

export default WelcomeScreen;
