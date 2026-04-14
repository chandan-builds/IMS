import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync prop changes that might happen from outside
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Only call onChange if the value actually differs
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={cn('relative flex w-full items-center', className)}>
      <Search
        className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none"
        size={18}
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] py-2 pl-10 pr-10 text-sm text-[var(--color-text-primary)] shadow-sm outline-none transition-colors focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-muted)]"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};