import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const icons = {
  success: <CheckCircle className="text-[var(--color-success)]" size={20} />,
  error: <XCircle className="text-[var(--color-danger)]" size={20} />,
  warning: <AlertCircle className="text-[var(--color-warning)]" size={20} />,
  info: <Info className="text-[var(--color-info)]" size={20} />,
};

const bgClasses = {
  success: 'bg-[var(--color-success-light)] border-[var(--color-success)]/30',
  error: 'bg-[var(--color-danger-light)] border-[var(--color-danger)]/30',
  warning: 'bg-[var(--color-warning-light)] border-[var(--color-warning)]/30',
  info: 'bg-[var(--color-info-light)] border-[var(--color-info)]/30',
};

const textClasses = {
  success: 'text-emerald-900 dark:text-emerald-100',
  error: 'text-red-900 dark:text-red-100',
  warning: 'text-amber-900 dark:text-amber-100',
  info: 'text-blue-900 dark:text-blue-100',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for transition
  };

  if (!isVisible && !onClose) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        bgClasses[type],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        className
      )}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className={cn('flex-1 text-sm font-medium leading-relaxed', textClasses[type])}>
        {message}
      </div>
      <button
        onClick={handleClose}
        className={cn(
          'shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10',
          textClasses[type]
        )}
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};