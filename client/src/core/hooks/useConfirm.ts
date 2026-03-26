import { useCallback } from 'react';
import { useConfirmStore } from '../ui/ConfirmDialog';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
}

export function useConfirm() {
  const open = useConfirmStore((s) => s.open);

  return useCallback(
    (options: ConfirmOptions): Promise<boolean> => open(options),
    [open],
  );
}
