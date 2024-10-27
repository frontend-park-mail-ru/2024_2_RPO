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
  useEffectRefs((refs) => {
    const div = refs.get('message_div') as HTMLDivElement;

    // Запускаем анимацию затухания через 3.5 секунды
    setTimeout(() => {
      div.classList.add('toast-notification__decay');
    }, 3500);

    // Запускаем анимацию схлопывания через 6 секунд
    setTimeout(() => {
      div.classList.add('toast-notification__collapse');
    }, 6000);

    // Удаляем уведомление из хранилища через 7 секунд
    setTimeout(() => {
      setToastNotificationStore(
        useToastNotificationStore().filter((toastMsg) => toastMsg.id !== id)
      );
    }, 7000);
  });

  return (
    <div
      ref="message_div"
      className={['toast-message', `toast-notification__${variant}`].join(' ')}
    >
      {title}
    </div>
  );
};
