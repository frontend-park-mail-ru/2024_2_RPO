import { ComponentProps } from '@/jsxCore/types';

interface InputProps extends ComponentProps {
  onEnter?: () => void;
  onChanged?: (newValue: string) => void;
  initialValue?: string;
  readOnly?: boolean;
  validationMessage?: string | undefined;
  copyOnClick?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Input = (props: InputProps) => {
  return (
    <div className="input__wrapper">
      <input
        className="input"
        readonly={props.readOnly === true ? true : undefined}
        placeholder={props.initialValue}
        ON_click={
          props.copyOnClick === true
            ? () => {
                if (props.initialValue !== undefined) {
                  navigator.clipboard.writeText(props.initialValue);
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
