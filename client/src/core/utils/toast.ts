import { useToastStore } from '../store/useToastStore';

export const toast = {
  success: (message: string) => {
    useToastStore.getState().addToast({ message, variant: 'success' });
  },
  error: (message: string) => {
    useToastStore.getState().addToast({ message, variant: 'error' });
  },
  warning: (message: string) => {
    useToastStore.getState().addToast({ message, variant: 'warning' });
  },
  info: (message: string) => {
    useToastStore.getState().addToast({ message, variant: 'info' });
  },
};
