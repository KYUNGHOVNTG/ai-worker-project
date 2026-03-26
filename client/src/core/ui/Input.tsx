import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'block w-full px-4 py-2.5 border rounded-xl bg-white text-sm text-slate-800',
          'placeholder-slate-400 transition-all',
          'hover:border-slate-300',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
          error
            ? 'border-rose-400 focus:ring-rose-400/20 focus:border-rose-400'
            : 'border-slate-200',
        ].join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-slate-400">{helperText}</span>
      )}
    </div>
  );
};
