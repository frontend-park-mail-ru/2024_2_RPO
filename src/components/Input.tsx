import { ComponentProps } from '@/jsxCore/types';

interface InputProps extends ComponentProps {
  onEnter?: () => void;
  initialValue?: string;
  readOnly?: boolean;
  validationMessage?: string;
  copyOnClick?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Input = (props: InputProps) => {
  return (
    <div className="input__wrapper">
      <input
        className="input"
        readonly={props.readOnly === true ? true : false}
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
      />
      {props.validationMessage !== undefined && (
        <div className="input__validation-message">Неправильный ввод!</div>
      )}
    </div>
  );
};
