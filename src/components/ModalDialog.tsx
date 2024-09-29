import { ButtonComponent } from './Button.js';
import { JSXChildType } from '/jsxCore/jsx-runtime';

interface ModalDialogProps {
  title?: string;
  content?: JSXChildType;
}

export const ModalDialog = (props: ModalDialogProps = {}) => {
  return (
    <div class="modal_dialog__back">
      <div class="modal_dialog">
        <div class="modal_dialog__title_block">
          <span class="modal_dialog__title">{props.title}</span>
          {ButtonComponent({ icon: 'bi-x' })}
        </div>
        {props.content}
      </div>
    </div>
  );
};
