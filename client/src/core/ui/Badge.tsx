import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'default' | 'info' | 'violet';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger:  'bg-rose-100 text-rose-600',
  default: 'bg-gray-100 text-gray-500',
  info:    'bg-blue-100 text-blue-700',
  violet:  'bg-violet-100 text-violet-700',
};

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-rose-500',
  default: 'bg-gray-400',
  info:    'bg-blue-500',
  violet:  'bg-violet-500',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  dot = false,
}) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  );
};
