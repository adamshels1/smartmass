import React from 'react';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import {AppHeader} from 'shared/ui/AppHeader/AppHeader.tsx';
import i18n from 'i18next';
import ReferralList from 'features/referrals/ui/ReferralList.tsx';

const ReferralsListScreen: React.FC = () => {
  return (
    <AppLayout>
      <AppHeader title={i18n.t('Мои приглашенные')} />
      <ReferralList />
    </AppLayout>
  );
};

export default ReferralsListScreen;
