import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id,
  value: controlledValue,
  onChange,
  defaultValue,
  disabled,
}) => {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(optValue);
    }
    onChange?.(optValue);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((v) => !v)}
          className={[
            'flex items-center justify-between w-full px-4 py-2.5 border rounded-xl bg-white text-sm text-left transition-all',
            isOpen
              ? 'ring-2 ring-brand-500/20 border-brand-500'
              : 'hover:border-slate-300',
            error
              ? 'border-rose-400 ring-2 ring-rose-400/20'
              : 'border-slate-200',
            disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          <span className={selectedLabel ? 'text-slate-800' : 'text-slate-400'}>
            {selectedLabel ?? placeholder ?? '선택하세요'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="p-1.5 max-h-56 overflow-y-auto">
              {options.map((opt) => {
                const isSelected = opt.value === selectedValue;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={[
                      'flex items-center justify-between w-full px-3.5 py-2.5 text-sm rounded-xl transition-all text-left',
                      isSelected
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-slate-400">{helperText}</span>
      )}
    </div>
  );
};
