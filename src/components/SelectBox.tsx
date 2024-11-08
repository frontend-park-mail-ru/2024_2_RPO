/**
 * Компонент выбора режима отображения доски
 * @returns JSX выбора режима отображения доски
 */

import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import './selectBox.scss';

export interface SelectBoxOption {
  title: string;
  icon: string;
}

interface SelectBoxProps extends ComponentProps {
  options: SelectBoxOption[];
  currentIndex: number;
  widthRem: number;
  readOnly?: boolean;
  onChange?: (newIndex: number) => void;
}
export const SelectBox = (props: SelectBoxProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const currentOption = props.options[props.currentIndex];
  return (
    <div
      className={['select-box', props.readOnly ? '' : 'select-box__editable']}
      style={`width: ${props.widthRem}rem`}
      ON_click={() => {
        if (props.readOnly) {
          return;
        }
        setIsOpened(!isOpened);
      }}
    >
      <div
        className={[
          'select-box__content',
          isOpened
            ? 'select-box__content__opened'
            : 'select-box__content__closed',
        ]}
      >
        <div class="select-box__button">
          <div>
            <i className={currentOption.icon}></i>
          </div>
          <div style="padding-left: 5px; flex-grow: 1">
            {currentOption.title}
          </div>
          {props.readOnly || (
            <div class="select-box__chevron-icon">
              <i class="bi-chevron-down"></i>
            </div>
          )}
        </div>
        {isOpened && (
          <div class="select-box__dropdown">
            <div style="height: 5px;" />
            {props.options
              .map((val, idx) => {
                return { ...val, idx };
              })
              .filter((val, idx) => {
                return idx !== props.currentIndex;
              })
              .map((option) => {
                return (
                  <div
                    class="select-box__option"
                    ON_click={() => {
                      if (props.onChange !== undefined) {
                        props.onChange(option.idx);
                      }
                    }}
                  >
                    <i className={option.icon} />
                    {option.title}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
