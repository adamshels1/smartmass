import React from 'react';
import LoginForm from '../entities/auth/ui/LoginForm.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const LoginScreen: React.FC = () => {
  return (
    <AppLayout>
      <LoginForm />
    </AppLayout>
  );
};

export default LoginScreen;
