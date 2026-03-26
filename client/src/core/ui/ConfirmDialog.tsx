import React from 'react';
import { create } from 'zustand';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, HelpCircle } from 'lucide-react';

/* ─── Types ─── */

type ConfirmVariant = 'danger' | 'warning' | 'default';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface ConfirmStoreState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
  open: (options: ConfirmOptions) => Promise<boolean>;
  close: (result: boolean) => void;
}

/* ─── Zustand Store ─── */

export const useConfirmStore = create<ConfirmStoreState>((set, get) => ({
  isOpen: false,
  options: { title: '', message: '' },
  resolve: null,

  open: (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      set({ isOpen: true, options, resolve });
    });
  },

  close: (result: boolean) => {
    const { resolve } = get();
    resolve?.(result);
    set({ isOpen: false, resolve: null });
  },
}));

/* ─── Variant Config ─── */

const variantConfig: Record<ConfirmVariant, {
  icon: React.ReactNode;
  iconBg: string;
  buttonVariant: 'primary' | 'outline';
  buttonClassName: string;
}> = {
  danger: {
    icon: <AlertTriangle size={20} className="text-rose-600" />,
    iconBg: 'bg-rose-50',
    buttonVariant: 'primary',
    buttonClassName: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/20',
  },
  warning: {
    icon: <AlertTriangle size={20} className="text-amber-600" />,
    iconBg: 'bg-amber-50',
    buttonVariant: 'primary',
    buttonClassName: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/20',
  },
  default: {
    icon: <HelpCircle size={20} className="text-brand-600" />,
    iconBg: 'bg-brand-50',
    buttonVariant: 'primary',
    buttonClassName: '',
  },
};

/* ─── ConfirmDialog Props ─── */

interface ConfirmDialogDirectProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

/* ─── Inner ─── */

const ConfirmDialogInner: React.FC<{
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, confirmText, cancelText, variant, onConfirm, onCancel }) => {
  const config = variantConfig[variant];

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
        {config.icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 whitespace-pre-line">{message}</p>
      <div className="flex items-center gap-3 w-full">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <Button
          variant={config.buttonVariant}
          className={`flex-1 ${config.buttonClassName}`}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};

/* ─── Global ConfirmDialog ─── */

export const ConfirmDialog: React.FC<ConfirmDialogDirectProps | Record<string, never>> = (props) => {
  const store = useConfirmStore();

  if ('isOpen' in props && typeof props.isOpen === 'boolean') {
    const {
      isOpen,
      title,
      message,
      confirmText = '확인',
      cancelText = '취소',
      variant = 'default',
      onConfirm,
      onCancel,
    } = props as ConfirmDialogDirectProps;

    return (
      <Modal isOpen={isOpen} onClose={onCancel} size="sm" showCloseButton={false}>
        <ConfirmDialogInner
          title={title}
          message={message}
          confirmText={confirmText}
          cancelText={cancelText}
          variant={variant}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </Modal>
    );
  }

  const { isOpen, options, close } = store;

  return (
    <Modal isOpen={isOpen} onClose={() => close(false)} size="sm" showCloseButton={false}>
      <ConfirmDialogInner
        title={options.title}
        message={options.message}
        confirmText={options.confirmText ?? '확인'}
        cancelText={options.cancelText ?? '취소'}
        variant={options.variant ?? 'default'}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </Modal>
  );
};
