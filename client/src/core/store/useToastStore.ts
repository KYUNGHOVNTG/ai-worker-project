import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (payload: { message: string; variant: ToastVariant }) => void;
  removeToast: (id: string) => void;
}

const MAX_TOASTS = 5;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: ({ message, variant }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      toasts: [
        ...state.toasts.slice(-(MAX_TOASTS - 1)),
        { id, message, variant },
      ],
    }));
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
