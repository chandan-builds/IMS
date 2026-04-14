import React from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, value, onChange, error, className, disabled, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 pr-10 text-sm text-[var(--color-text-primary)] shadow-sm outline-none transition-colors',
              'focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-primary)]',
              'disabled:cursor-not-allowed disabled:bg-[var(--color-bg-hover)] disabled:text-[var(--color-text-muted)]',
              error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
            )}
            {...props}
          >
            <option value="" disabled hidden>
              Select an option
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn(
              'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
              disabled ? 'text-[var(--color-text-muted)] opacity-50' : 'text-[var(--color-text-secondary)]'
            )}
            size={16}
          />
        </div>
        {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';