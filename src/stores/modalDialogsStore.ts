import { defineStore } from '@/jsxCore/hooks';

/* eslint-disable @typescript-eslint/no-unused-vars */
interface ModalDialogs {
  isUserProfileOpened: boolean;
}

export const [useModalDialogsStore, setModalDialogsStore] =
  defineStore<ModalDialogs>('modalDialogs', {
    isUserProfileOpened: false,
  });
