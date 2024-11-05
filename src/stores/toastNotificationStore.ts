import { defineStore } from '@/jsxCore/hooks';

export type ToastVariant = 'success' | 'error' | 'warning';

export interface Toast {
  id: number;
  title: string;
  variant: ToastVariant;
}

let toastId = 0;

export const [useToastNotificationStore, setToastNotificationStore] =
  defineStore<Toast[]>('toast', []);

export const showToast = (message: string, variant: ToastVariant) => {
  const currentToasts = useToastNotificationStore();
  const newToast: Toast = { id: toastId++, title: message, variant };
  setToastNotificationStore([...currentToasts, newToast]);
};

export const removeToast = (id: number) => {
  const currentToasts = useToastNotificationStore();
  const updatedToasts = currentToasts.filter((toast) => toast.id !== id);
  setToastNotificationStore(updatedToasts);
};
