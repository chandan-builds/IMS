import React from 'react';
import { useUnitViewModel } from '../hooks/useUnitViewModel';
import { Select } from '../../../components/ui/Select';

interface UnitSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  className?: string;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({ value, onChange, error, label = "Unit", className }) => {
  const { units, isLoading } = useUnitViewModel();

  const options = units.map(unit => ({
    label: `${unit.name} (${unit.symbol})`,
    value: unit.id
  }));

  if (isLoading) {
    return <div className="text-sm text-[var(--color-text-muted)] mt-2 mb-2">Loading units...</div>;
  }

  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      error={error}
      className={className}
    />
  );
};
