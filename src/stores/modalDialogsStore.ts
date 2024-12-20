import { defineStore } from '@/jsxCore/hooks';

interface ModalDialogs {
  isUserProfileOpened: boolean;
  isBoardSettingsOpened: boolean;
  isTagSettingsOpened: boolean;
}

const defaultFlags: ModalDialogs = {
  isUserProfileOpened: false,
  isBoardSettingsOpened: false,
  isTagSettingsOpened: false,
};

export const [useModalDialogsStore, setModalDialogsStore] =
  defineStore<ModalDialogs>('modalDialogs', defaultFlags);

export const openUserProfileModalDialog = () => {
  setModalDialogsStore({ ...defaultFlags, isUserProfileOpened: true });
};
export const closeUserProfileModalDialog = () => {
  setModalDialogsStore(defaultFlags);
};

export const openBoardSettingsModalDialog = () => {
  setModalDialogsStore({ ...defaultFlags, isBoardSettingsOpened: true });
};

export const closeBoardSettingsModalDialog = () => {
  setModalDialogsStore(defaultFlags);
};

export const openTagsModalDialog = () => {
  setModalDialogsStore({ ...defaultFlags, isTagSettingsOpened: true });
};

export const closeTagsModalDialog = () => {
  setModalDialogsStore(defaultFlags);
};
