import { defineStore } from '@/jsxCore/hooks';

interface ModalDialogs {
  isUserProfileOpened: boolean;
}

export const [useModalDialogsStore, setModalDialogsStore] =
  defineStore<ModalDialogs>('modalDialogs', {
    isUserProfileOpened: false,
  });
