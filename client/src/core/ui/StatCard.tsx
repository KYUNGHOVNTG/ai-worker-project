import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type StatColor = 'brand' | 'emerald' | 'amber' | 'violet' | 'rose' | 'blue';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: StatColor;
  className?: string;
}

const colorMap: Record<StatColor, { bg: string; text: string; icon: string }> = {
  brand:   { bg: 'bg-brand-50',   text: 'text-brand-600',   icon: 'bg-brand-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: 'bg-amber-100' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  icon: 'bg-violet-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-500',    icon: 'bg-rose-100' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: 'bg-blue-100' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  color = 'brand',
  className = '',
}) => {
  const c = colorMap[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 card-hover',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon} ${c.text}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={[
              'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md',
              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500',
            ].join(' ')}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-slate-400">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};
