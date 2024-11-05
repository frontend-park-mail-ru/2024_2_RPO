import { defineStore } from '@/jsxCore/hooks';

interface ModalDialogs {
  isUserProfileOpened: boolean;
  isBoardSettingsOpened: boolean;
}

export const [useModalDialogsStore, setModalDialogsStore] =
  defineStore<ModalDialogs>('modalDialogs', {
    isUserProfileOpened: false,
    isBoardSettingsOpened: false,
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

export const openBoardSettingsModalDialog = () => {
  const modalDialogsStore = useModalDialogsStore();
  modalDialogsStore.isBoardSettingsOpened = true;
  setModalDialogsStore(modalDialogsStore);
};
export const closeBoardSettingsModalDialog = () => {
  const modalDialogsStore = useModalDialogsStore();
  modalDialogsStore.isBoardSettingsOpened = false;
  setModalDialogsStore(modalDialogsStore);
};
