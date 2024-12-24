import React from 'react';
import EmailVerificationForm from 'entities/auth/ui/EmailVerificationForm.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const EmailVerificationScreen: React.FC = () => {
  return (
    <AppLayout>
      <EmailVerificationForm />
    </AppLayout>
  );
};

export default EmailVerificationScreen;
