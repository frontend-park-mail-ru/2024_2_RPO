import { Button } from '@/components/Button';
import { ComponentProps, JsxNode } from '@/jsxCore/types';

interface ModalDialogProps extends ComponentProps {
  title?: string;
  children?: JsxNode;
  closeCallback?: () => void;
}

/**
 * Компонент модального диалога
 * @param props Пропсы модального диалога
 * @returns JSX модального диалога
 */
export const ModalDialog = (props: ModalDialogProps) => {
  return (
    <div class="modal-dialog__container">
      <div class="modal-dialog">
        <div class="modal-dialog__header-block">
          <span class="modal-dialog__title">{props.title}</span>
          <Button key="close_btn" icon="bi-x" callback={props.closeCallback} />
        </div>
        <hr class="mb-16px" />
        {props.children}
      </div>
    </div>
  );
};
