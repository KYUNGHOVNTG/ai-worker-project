import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastItem, ToastVariant } from '../store/useToastStore';
import { useToastStore } from '../store/useToastStore';

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: 'bg-white border-l-4 border-emerald-500',
    icon: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
  },
  error: {
    container: 'bg-white border-l-4 border-rose-500',
    icon: <XCircle className="h-5 w-5 text-rose-500 shrink-0" />,
  },
  warning: {
    container: 'bg-white border-l-4 border-amber-500',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
  },
  info: {
    container: 'bg-white border-l-4 border-brand-500',
    icon: <Info className="h-5 w-5 text-brand-500 shrink-0" />,
  },
};

const AUTO_DISMISS_MS = 3000;

interface ToastProps {
  toast: ToastItem;
}

export function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore((s) => s.removeToast);
  const { container, icon } = VARIANT_STYLES[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3.5 shadow-md ${container} min-w-[280px] max-w-[380px] animate-slide-in`}
      role="alert"
    >
      {icon}
      <p className="flex-1 text-sm text-slate-800 leading-snug">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        aria-label="닫기"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
