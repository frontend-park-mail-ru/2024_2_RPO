// ToastContainer.tsx
import { ComponentProps } from '@/jsxCore/types';
import { useToastNotificationStore } from '@/stores/toastNotificationStore';

interface ToastMessageProps extends ComponentProps {
  title: string;
  id: number;
  variant: 'success' | 'error' | 'warning';
}

export const ToastContainer = () => {
  const store = useToastNotificationStore();

  return (
    <div className="toast-container">
      {store.toasts.map((toast) => (
        <ToastMessage key={toast.id.toString()} {...toast} />
      ))}
    </div>
  );
};

const ToastMessage = ({ title, variant }: ToastMessageProps) => {
  const variantClass = `toast-message toast-${variant}`; // Присваиваем класс в зависимости от типа уведомления

  return <div className={variantClass}>{title}</div>;
};
