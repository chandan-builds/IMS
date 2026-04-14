import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--color-bg-card)] p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
