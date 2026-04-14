import React from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../features/auth/components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Welcome back to IMS"
    >
      <LoginForm />
    </AuthLayout>
  );
};
