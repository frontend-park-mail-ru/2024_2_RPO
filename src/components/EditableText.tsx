import { useEffectRefs, useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { noop } from '@/utils/noop';
import './editableText.scss';

interface EditableTextProps extends ComponentProps {
  text: string;
  setText: (newText: string, oldText: string) => void;
  textClassName?: string;
  wrapperClassName?: string;
  readOnly?: boolean;
  wrapText?: boolean;
}

/**
 * Компонент кнопки
 * @param props Пропсы кнопки
 * @returns JSX кнопки
 */
export const EditableText = (props: EditableTextProps) => {
  const [isInput, setIsInput] = useState(false);
  const [oldText, setOldText] = useState(props.text);
  if (isInput) {
    let saveCb: () => void = noop;
    useEffectRefs((refs) => {
      const inpElem = refs.get('content') as HTMLInputElement;

      if (inpElem.value === '') {
        inpElem.value = props.text;
      }
      if (props.wrapText) {
        inpElem.style.height = 'auto';
        inpElem.style.height = inpElem.scrollHeight + 'px';
      }

      saveCb = () => {
        setIsInput(false);
        const newText = inpElem.value;
        props.setText(newText.trim(), oldText);
      };

      setTimeout(() => {
        inpElem.focus();
      }, 150);

      if (props.wrapText) {
        return;
      }

      if (inpElem.value === '') {
        inpElem.style.width = inpElem.value.length + 'ch';
      }

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
    });
    return (
      <div
        className={[
          props.wrapperClassName,
          'editable-text__text-input-wrapper',
          props.wrapText && 'editable-text__text-input-wrapper__wrap',
        ]}
      >
        {props.wrapText ? (
          <textarea
            className={[props.textClassName, 'editable-text__textarea']}
            style="width: 100%"
            ref="content"
            ON_input={(ev: Event) => {
              const elem = ev.target as HTMLTextAreaElement;
              elem.style.height = 'auto';
              elem.style.height = elem.scrollHeight + 'px';
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
        ) : (
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
        )}
      </div>
    );
  }
  return (
    <div
      className={[
        'editable-text__text-wrapper',
        props.wrapperClassName ?? '',
        !props.readOnly && 'editable-text__text-wrapper__editable',
      ]}
      ON_click={(ev: PointerEvent) => {
        ev.stopPropagation();
        if (!props.readOnly) {
          setOldText(props.text);
          setIsInput(true);
        }
      }}
      ON_mousedown={(ev: PointerEvent) => {
        ev.stopPropagation();
      }}
    >
      <div
        className={[
          props.textClassName ?? '',
          props.wrapText ? 'editable-text__text-wrapper__wrap' : '',
        ]}
      >
        {props.text}
      </div>
    </div>
  );
};
