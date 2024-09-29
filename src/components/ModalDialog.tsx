import { ButtonComponent } from './Button.js';
import { JSXChildType } from '/jsxCore/jsx-runtime';
import { noop } from '/utils/noop.js';

interface ModalDialogProps {
  title?: string;
  content?: JSXChildType;
  closeCallback?: () => void;
}

export const ModalDialog = (props: ModalDialogProps = {}) => {
  return (
    <div class="modal-dialog__back">
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
