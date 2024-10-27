import { ComponentProps } from '@/jsxCore/types';

interface InputProps extends ComponentProps {
  onEnter?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Input = (props: InputProps) => {
  return (
    <div className="input__wrapper">
      <input className="input" />
      <div className="input__validation-message">Неправильный ввод!</div>
    </div>
  );
};
