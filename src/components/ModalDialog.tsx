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
    <div class="modal_dialog__back">
      <div class="modal_dialog">
        <div class="modal_dialog__title_block">
          <span class="modal_dialog__title">{props.title}</span>
          {ButtonComponent({
            icon: 'bi-x',
            callback: props.closeCallback ?? noop,
          })}
        </div>
        <hr style="margin-bottom:15px" />
        {props.content}
      </div>
    </div>
  );
};
