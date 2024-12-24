import React from 'react';
import RegisterForm from '../entities/auth/ui/RegisterForm.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const RegisterScreen: React.FC = () => {
  return (
    <AppLayout>
      <RegisterForm />
    </AppLayout>
  );
};

export default RegisterScreen;
