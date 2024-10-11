import { ButtonComponent } from '@/components/Button';
import { JsxNode } from '@/jsxCore/types';
import { noop } from '@/utils/noop';

interface ModalDialogProps {
  title?: string;
  content?: JsxNode;
  closeCallback?: () => void;
}

/**
 * Компонент модального диалога
 * @param props Пропсы модального диалога
 * @returns JSX модального диалога
 */
export const ModalDialog = (props: ModalDialogProps = {}) => {
  return (
    <div class="modal-dialog__container">
      <div class="modal-dialog">
        <div class="modal-dialog__header-block">
          <span class="modal-dialog__title">{props.title}</span>
          {ButtonComponent({
            icon: 'bi-x',
            callback: props.closeCallback ?? noop,
          })}
        </div>
        <hr class="mb-16px" />
        {props.content}
      </div>
    </div>
  );
};
