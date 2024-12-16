import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';

interface InputProps extends ComponentProps {
  onEnter?: (value: string) => void;
  onEscape?: (value: string) => void;
  onChanged?: (newValue: string) => void;
  onBlur?: () => void;
  initialValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  validationMessage?: string | undefined;
  isPassword?: boolean;
  focusOnInstance?: boolean;
}

//TODO исправить эти баги

export const Input = (props: InputProps) => {
  const [init, setInit] = useState(false);
  const [value, setValue] = useState('');
  useEffectRefs((refs) => {
    const inp = refs.get('input') as HTMLInputElement;
    if (!init) {
      if (props.initialValue) {
        inp.value = props.initialValue;
      }
      setTimeout(() => {
        if (props.onChanged) {
          props.onChanged(inp.value);
        }
        if (props.focusOnInstance) {
          inp.focus();
        }
      }, 200);
      setInit(true);
    }
  });
  return (
    <div className="input__wrapper">
      <input
        ref="input"
        className="input"
        readonly={props.readOnly === true ? true : undefined}
        placeholder={props.placeholder}
        type={props.isPassword ? 'password' : undefined}
        ON_keydown={(ev: KeyboardEvent) => {
          if (ev.key === 'Enter') {
            if (props.onEnter !== undefined) {
              props.onEnter(value);
            }
          }
          if (ev.key === 'Escape') {
            ev.stopPropagation();
            if (props.onEscape !== undefined) {
              props.onEscape(value);
            }
            (ev.target as HTMLInputElement).blur();
          }
        }}
        ON_input={(ev: InputEvent) => {
          const newValue = (ev.target as HTMLInputElement).value;
          setValue(newValue);
          if (props.onChanged !== undefined) {
            props.onChanged(newValue);
          }
        }}
        ON_blur={() => {
          if (props.onBlur !== undefined) {
            props.onBlur();
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
