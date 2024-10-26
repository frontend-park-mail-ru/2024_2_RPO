type ToastVariant = "success" | "error" | "warning";

interface Toast {
    id: number;
    title: string;
    variant: ToastVariant;
}

let toastId = 0;
const toasts: Toast[] = [];

export const useToastNotificationStore = () => ({
    toasts,
    addToast: (toast: Toast) => {
        toasts.push(toast);
    },
    removeToast: (id: number) => {
        const index = toasts.findIndex(t => t.id === id);
        if (index !== -1) toasts.splice(index, 1);
    }
});

export const showToast = (message: string, variant: ToastVariant = "success") => {
    const store = useToastNotificationStore();
    const newToast: Toast = { id: toastId++, title: message, variant };
    store.addToast(newToast);
};
