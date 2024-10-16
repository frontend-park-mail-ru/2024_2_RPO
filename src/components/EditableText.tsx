import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';

interface EditableTextProps extends ComponentProps {
  text: string;
  setText: (state: string) => void;
  textClassName?: string;
  wrapperClassName?: string;
}

/**
 * Компонент кнопки
 * @param props Пропсы кнопки
 * @returns JSX кнопки
 */
export const EditableText = (props: EditableTextProps) => {
  const [isInput, setIsInput] = useState(false);
  if (isInput) {
    return (
      <>
        <input ref="content" />
      </>
    );
  }
  return (
    <div
      className={['editable-text__text-wrapper', props.wrapperClassName ?? '']}
      ON_click={() => {
        setIsInput(true);
      }}
    >
      <div className={props.textClassName ?? ''}>{props.text}</div>
    </div>
  );
};
