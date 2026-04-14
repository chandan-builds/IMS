import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { FileQuestion } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FileQuestion size={40} className="text-[var(--color-text-muted)]" />,
  title,
  message,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)]/50 p-10 text-center transition-colors hover:bg-[var(--color-bg-card)]',
        className
      )}
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-bg-hover)] shadow-inner">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="default" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};