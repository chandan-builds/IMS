import React from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { RegisterForm } from '../features/auth/components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start managing your inventory with IMS"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
