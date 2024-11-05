import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { noop } from '@/utils/noop';
import "./editableText.scss"

interface EditableTextProps extends ComponentProps {
  text: string;
  setText: (state: string) => void;
  textClassName?: string;
  wrapperClassName?: string;
  readOnly?: boolean;
}

/**
 * Компонент кнопки
 * @param props Пропсы кнопки
 * @returns JSX кнопки
 */
export const EditableText = (props: EditableTextProps) => {
  const [isInput, setIsInput] = useState(false);
  if (isInput) {
    let saveCb: () => void = noop;
    useEffectRefs((refs) => {
      const inpElem = refs.get('content') as HTMLInputElement;

      inpElem.focus();

      // Пропатчить стили для инпута, потому что просто навесить класс не получится. Немного костыльно, ну и ладно
      const tempElement = document.createElement('div');
      tempElement.className = props.textClassName ?? '';
      document.body.appendChild(tempElement);
      const computedStyles = window.getComputedStyle(tempElement);
      for (const style of ['font-size', 'font-weight', 'font-family']) {
        inpElem.style.setProperty(
          style,
          computedStyles.getPropertyValue(style)
        );
      }
      document.body.removeChild(tempElement);

      if (inpElem.value === '') {
        inpElem.value = props.text;
        inpElem.style.width = inpElem.value.length + 'ch';
      }
      saveCb = () => {
        setIsInput(false);
        const newText = inpElem.value;
        if (newText.length < 2) {
          props.setText(props.text);
        } else {
          props.setText(newText);
        }
      };
    });
    return (
      <div
        className={[
          props.wrapperClassName,
          'editable-text__text-input-wrapper',
        ]}
      >
        <input
          type="text"
          className={[props.textClassName, 'editable-text__text-input']}
          ref="content"
          ON_input={(event: InputEvent) => {
            const inpElem = event.target as HTMLInputElement;
            inpElem.style.width = inpElem.value.length + 'ch';
          }}
          ON_blur={() => {
            saveCb();
          }}
          ON_keydown={(event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              saveCb();
            }
          }}
        />
      </div>
    );
  }
  return (
    <div
      className={[
        'editable-text__text-wrapper',
        props.wrapperClassName ?? '',
        !props.readOnly && 'editable-text__text-wrapper_editable',
      ]}
      ON_click={() => {
        if (!props.readOnly) {
          setIsInput(true);
        }
      }}
    >
      <div className={props.textClassName ?? ''}>{props.text}</div>
    </div>
  );
};
