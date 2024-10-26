import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BoardSettings = (props: ComponentProps) => {
  return (
    <ModalDialog
      key="modal_dialog"
      title="Настройки доски"
      isOpened={true}
    ></ModalDialog>
  );
};
