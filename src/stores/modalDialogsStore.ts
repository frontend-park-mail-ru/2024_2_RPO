import { defineStore } from '@/jsxCore/hooks';

interface ModalDialogs {
  isUserProfileOpened: boolean;
}

export const [useModalDialogsStore, setModalDialogsStore] =
  defineStore<ModalDialogs>('modalDialogs', {
    isUserProfileOpened: false,
  });

export const openUserProfileModalDialog = () => {
  const modalDialogsStore = useModalDialogsStore();
  modalDialogsStore.isUserProfileOpened = true;
  setModalDialogsStore(modalDialogsStore);
};
export const closeUserProfileModalDialog = () => {
  const modalDialogsStore = useModalDialogsStore();
  modalDialogsStore.isUserProfileOpened = false;
  setModalDialogsStore(modalDialogsStore);
};
