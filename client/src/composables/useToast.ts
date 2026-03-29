import { useStorage, useTimeoutFn } from '@vueuse/core';

type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

const INTERVAL_MS = 3000;

const toasts = useStorage<ToastItem[]>('app-toasts', []);

export function useToast() {
  const show = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    toasts.value.push({ id, message, type });

    const { start } = useTimeoutFn(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, INTERVAL_MS);
    start();
  };

  const remove = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, show, remove };
}
