import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { showToast } from '@/stores/toastNotificationStore';

interface InputProps extends ComponentProps {
  onEnter?: (value: string) => void;
  onEscape?: (value: string) => void;
  onChanged?: (newValue: string) => void;
  initialValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  validationMessage?: string | undefined;
  copyOnClick?: boolean;
  isPassword?: boolean;
  focusOnInstance?: boolean;
}

interface Callbacks {
  onKeyPress: (ev: KeyboardEvent) => void;
  onClick: (ev: MouseEvent) => void;
  onChanged: (ev: Event) => void;
}

//TODO исправить эти баги

let globalUid = 0;
const instMap: Map<number, Callbacks> = new Map();

let tttt = 0;

export const Input = (props: InputProps) => {
  const [activated, setIsActivated] = useState(false);
  const [uid, setUid] = useState(-1);
  useEffectRefs((refs) => {
    const inp = refs.get('input') as HTMLInputElement;
    if (!activated) {
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
      setIsActivated(true);
      const myUid = globalUid;
      globalUid++;
      setUid(myUid);
      inp.addEventListener('keyup', (ev: KeyboardEvent) => {
        const CBs = instMap.get(myUid);
        if (CBs !== undefined) {
          CBs.onKeyPress(ev);
        }
      });
      inp.addEventListener('click', (ev: MouseEvent) => {
        const CBs = instMap.get(myUid);
        if (CBs !== undefined) {
          CBs.onClick(ev);
        }
      });
      inp.addEventListener('change', (ev: Event) => {
        const CBs = instMap.get(myUid);
        if (CBs !== undefined) {
          CBs.onChanged(ev);
        }
      });
    } else {
      instMap.set(uid, {
        onKeyPress: (ev) => {
          if (ev.key === 'Enter') {
            if (props.onEnter) {
              props.onEnter(inp.value);
            }
          }
          if (ev.key === 'Escape') {
            if (props.onEscape) {
              props.onEscape(inp.value);
            }
          }
          if (props.onChanged) {
            props.onChanged(inp.value);
          }
        },
        onClick: () => {
          if (props.copyOnClick === true) {
            navigator.clipboard.writeText(inp.value);
            showToast('Скопировано в буфер обмена!', 'success');
            if (props.onChanged) {
              props.onChanged(inp.value);
            }
          }
        },
        onChanged: () => {
          if (props.onChanged) {
            props.onChanged(inp.value);
          }
        },
      });
    }
  });
  tttt++;
  return (
    <div className="input__wrapper">
      <input
        name={tttt.toString()}
        ref="input"
        className="input"
        readonly={props.readOnly === true ? true : undefined}
        placeholder={props.placeholder}
        type={props.isPassword ? 'password' : undefined}
      />
      {props.validationMessage !== undefined && (
        <div className="input__validation-message">
          {props.validationMessage}
        </div>
      )}
    </div>
  );
};
