import { useEffectRefs } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { showToast } from '@/stores/toastNotificationStore';

interface InputProps extends ComponentProps {
  onEnter?: (value: string) => void;
  onEscape?: (value: string) => void;
  onChanged?: (newValue: string) => void;
  initialValue?: string;
  readOnly?: boolean;
  validationMessage?: string | undefined;
  copyOnClick?: boolean;
  isPassword?: boolean;
  focusOnInstance?: boolean;
}

export const Input = (props: InputProps) => {
  useEffectRefs((refs) => {
    const inp = refs.get('input') as HTMLInputElement;
    if (!inp.classList.contains('wasActivated') && props.focusOnInstance) {
      inp.focus();
      inp.classList.add('wasActivated');
    }
  });
  return (
    <div className="input__wrapper">
      <input
        ref="input"
        className="input"
        readonly={props.readOnly === true ? true : undefined}
        placeholder={props.initialValue}
        type={props.isPassword ? 'password' : undefined}
        ON_keydown={(event: KeyboardEvent) => {
          const tgt = event.target as HTMLInputElement;
          if (event.key === 'Enter') {
            if (props.onEnter) {
              props.onEnter(tgt.value);
            }
          }
          if (event.key === 'Escape') {
            if (props.onEscape) {
              props.onEscape(tgt.value);
            }
          }
        }}
        ON_click={
          props.copyOnClick === true
            ? () => {
                if (props.initialValue !== undefined) {
                  navigator.clipboard.writeText(props.initialValue);
                  showToast('Скопировано в буфер обмена!', 'success');
                }
              }
            : undefined
        }
        ON_change={(event: InputEvent) => {
          if (props.onChanged !== undefined) {
            props.onChanged((event.target as HTMLInputElement).value);
          }
        }}
      />
      {props.validationMessage !== undefined && (
        <div className="input__validation-message">
          {props.validationMessage}
        </div>
      )}
    </div>
  );
};
