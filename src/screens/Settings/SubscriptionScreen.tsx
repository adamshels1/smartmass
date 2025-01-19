import React from 'react';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import SubscriptionManager from 'entities/subscription/ui/SubscriptionManager.tsx';
import i18n from 'i18next';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';

const SubscriptionScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title={i18n.t('Подписка')} />
      <SubscriptionManager />
    </AppLayout>
  );
};

export default SubscriptionScreen;
