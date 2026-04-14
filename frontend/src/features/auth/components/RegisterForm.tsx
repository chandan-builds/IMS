import React from 'react';
import { Mail, Lock, User, Building, Phone } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useRegisterViewModel } from '../hooks/useRegisterViewModel';

export const RegisterForm: React.FC = () => {
  const {
    orgName, setOrgName,
    userName, setUserName,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error,
    isLoading,
    handleRegister,
  } = useRegisterViewModel();

  return (
    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
      {error && (
        <div className="p-3 text-sm text-[var(--color-danger)] bg-red-500/10 border border-red-500/20 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4 rounded-md shadow-sm">
        <Input
          label="Organization Name"
          id="orgName"
          name="orgName"
          type="text"
          required
          value={orgName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrgName(e.target.value)}
          placeholder="Enter organization name"
          icon={<Building className="h-4 w-4" />}
        />

        <Input
          label="User Name"
          id="userName"
          name="userName"
          type="text"
          required
          value={userName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
          placeholder="Enter your name"
          icon={<User className="h-4 w-4" />}
        />

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
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          required
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          icon={<Phone className="h-4 w-4" />}
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="Create a password"
          icon={<Lock className="h-4 w-4" />}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          icon={<Lock className="h-4 w-4" />}
        />
      </div>

      <div>
        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          Sign up
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <span className="text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
            Sign in
          </a>
        </span>
      </div>
    </form>
  );
};
