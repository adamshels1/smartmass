import React from 'react';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import i18n from 'i18next';
import MyReferral from 'features/referrals/ui/MyReferral.tsx';

const ReferralsListScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title={i18n.t('Моя реферальная ссылка')} />
      <MyReferral />
    </AppLayout>
  );
};

export default ReferralsListScreen;
