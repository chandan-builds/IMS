import React from 'react';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuthViewModel } from '../hooks/useAuthViewModel';

export const LoginForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  } = useAuthViewModel();

  return (
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      {error && (
        <div className="p-3 text-sm text-[var(--color-danger)] bg-red-500/10 border border-red-500/20 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4 rounded-md shadow-sm">
        <Input
          label="Email address"
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Enter your email"
          icon={<Mail className="h-4 w-4" />}
        />
        
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon={<Lock className="h-4 w-4" />}
        />
      </div>

      <div>
        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
};
