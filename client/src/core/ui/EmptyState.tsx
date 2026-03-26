import React from 'react';
import { Inbox, Search, AlertCircle } from 'lucide-react';

type EmptyStateVariant = 'default' | 'search' | 'error';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const ICON_MAP: Record<EmptyStateVariant, React.FC<{ className?: string }>> = {
  default: ({ className }) => <Inbox className={className} />,
  search: ({ className }) => <Search className={className} />,
  error: ({ className }) => <AlertCircle className={className} />,
};

const ICON_COLOR_MAP: Record<EmptyStateVariant, string> = {
  default: 'text-slate-300',
  search: 'text-slate-300',
  error: 'text-rose-300',
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  title,
  description,
  action,
  className = '',
}) => {
  const Icon = ICON_MAP[variant];
  const iconColor = ICON_COLOR_MAP[variant];

  return (
    <div
      className={[
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon className={['w-12 h-12 mb-4', iconColor].join(' ')} />
      <p className="text-base font-semibold text-slate-700 mb-1.5">{title}</p>
      {description && (
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
