import React from 'react';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import SubscriptionManager from 'entities/subscription/ui/SubscriptionManager.tsx';

const SubscriptionScreen: React.FC = () => {
  return (
    <AppLayout>
      <SubscriptionManager />
    </AppLayout>
  );
};

export default SubscriptionScreen;
