import { useMemo } from 'react';
import { Select } from './Select';

interface YearSelectProps {
  value: string;
  onChange: (year: string) => void;
  startYear?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function YearSelect({
  value,
  onChange,
  startYear = 2024,
  label,
  className,
  disabled,
}: YearSelectProps) {
  const options = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: { value: string; label: string }[] = [];
    for (let y = currentYear; y >= startYear; y--) {
      years.push({ value: String(y), label: `${y}년` });
    }
    return years;
  }, [startYear]);

  return (
    <Select
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
    />
  );
}
