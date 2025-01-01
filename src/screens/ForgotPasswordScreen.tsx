import React from 'react';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import ForgotPassword from 'entities/auth/ui/ForgotPassword.tsx';

const ForgotPasswordScreen: React.FC = () => {
  return (
    <AppLayout>
      <ForgotPassword />
    </AppLayout>
  );
};

export default ForgotPasswordScreen;
