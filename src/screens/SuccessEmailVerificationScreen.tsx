import React from 'react';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import {SuccessEmailVerification} from 'entities/auth/ui/SuccessEmailVerification.tsx';

const SuccessEmailVerificationScreen: React.FC = () => {
  return (
    <AppLayout>
      <SuccessEmailVerification />
    </AppLayout>
  );
};

export default SuccessEmailVerificationScreen;
