import { ComponentProps } from '@/jsxCore/types';
import { useToastNotificationStore } from '@/stores/toastNotificationStore';
import { Toast } from '@/stores/toastNotificationStore';

interface ToastMessageProps extends ComponentProps {
  title: string;
  id: number;
  variant: 'success' | 'error' | 'warning';
}

export const ToastContainer = () => {
  const toasts = useToastNotificationStore();
  return (
    <div className="toast-container">
      {toasts.map((toast: Toast) => (
        <ToastMessage
          key={toast.id.toString()}
          title={toast.title}
          id={toast.id}
          variant={toast.variant}
        />
      ))}
    </div>
  );
};

const ToastMessage = ({ title, variant }: ToastMessageProps) => {
  const variantClass = `toast-message toast-${variant}`;

  return <div className={variantClass}>{title}</div>;
};
