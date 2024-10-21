import { Button } from '@/components/Button';
import { ComponentProps, JsxNode } from '@/jsxCore/types';

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
    <div class="modal-dialog__container">
      <div class="modal-dialog">
        <div class="modal-dialog__header-block">
          <div className="modal-dialog__title-wrapper">
            <span class="modal-dialog__title">{props.title}</span>
          </div>
          <Button key="close_btn" icon="bi-x-lg" callback={props.closeCallback} />
        </div>
        <hr class="mb-16px" />
        {props.children}
      </div>
    </div>
  );
};
