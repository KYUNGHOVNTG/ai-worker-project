import React from 'react';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
  height?: 'sm' | 'md';
}

function getBarColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 50) return 'bg-brand-500';
  return 'bg-amber-400';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  className = '',
  height = 'sm',
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const barColor = getBarColor(clamped);
  const heightClass = height === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-gray-100 rounded-full ${heightClass}`}>
        <div
          className={`${barColor} rounded-full ${heightClass} transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 w-8 text-right shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
};
