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

    // Анимация затухания через 3.5 секунды
    setTimeout(() => {
      div.classList.remove('toast-message__collapse');
    }, 30);

    // Анимация затухания через 3.5 секунды
    setTimeout(() => {
      div.classList.add('toast-message__decay');
    }, 3500);

    // Анимация схлопывания через 6 секунд
    setTimeout(() => {
      div.classList.add('toast-message__collapse');
    }, 6000);

    // Удаление уведомления из хранилища через 7 секунд
    setTimeout(() => {
      setToastNotificationStore(
        useToastNotificationStore().filter((toastMsg) => toastMsg.id !== id)
      );
    }, 7000);
  });

  return (
    <div
      ref="message_div"
      className={['toast-message', 'toast-message__collapse', `toast-message__${variant}`].join(' ')}
    >
      {title}
    </div>
  );
};
