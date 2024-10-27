import { ComponentProps } from '@/jsxCore/types';
import {
  useToastNotificationStore,
  setToastNotificationStore,
  Toast,
  ToastVariant,
} from '@/stores/toastNotificationStore';
import { useEffectRefs } from '@/jsxCore/hooks';

interface ToastMessageProps extends ComponentProps {
  title: string;
  id: number;
  variant: ToastVariant;
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

const ToastMessage = ({ title, id, variant }: ToastMessageProps) => {
  // Автоматическое удаление уведомления через 6 секунд
  setTimeout(() => {
    setToastNotificationStore(
      useToastNotificationStore().filter((toastMsg) => toastMsg.id !== id)
    );
  }, 6000);

  // Используем useEffectRefs для добавления класса с задержкой
  useEffectRefs((refs) => {
    const div = refs.get('message_div') as HTMLDivElement;
    setTimeout(() => {
      div.classList.add('toast-notification__delay');
    }, 5000);
  });

  return (
    <div
      ref="message_div" // Устанавливаем реф
      className={['toast-message', `toast-notification__${variant}`].join(' ')}
    >
      {title}
    </div>
  );
};
