import { ComponentProps, JsxNode } from '@/jsxCore/types';
import './modalDialog.scss';

interface ModalDialogProps extends ComponentProps {
  title?: string;
  children?: JsxNode;
  closeCallback?: () => void;
  isOpened: boolean;
}

/**
 * Компонент модального диалога
 * @param props Пропсы модального диалога
 * @returns JSX модального диалога
 */
export const ModalDialog = (props: ModalDialogProps) => {
  if (!props.isOpened) {
    return <div style="display:none" />;
  }
  return (
    <div class="full-screen-dark">
      <div class="modal-dialog">
        <div class="modal-dialog__header-block">
          <div className="modal-dialog__title-wrapper">
            <div class="modal-dialog__title">{props.title}</div>
          </div>
          <div
            class="modal-dialog__close-button"
            ON_click={props.closeCallback}
          >
            <i class="bi-x-lg" />
          </div>
        </div>
        <hr style="margin-bottom: 20px;" />
        <div>{props.children}</div>
      </div>
    </div>
  );
};
