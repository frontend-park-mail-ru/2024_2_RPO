import { ComponentProps } from '@/jsxCore/types';

interface ButtonProps extends ComponentProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
  variant?: 'default' | 'negative' | 'positive' | 'accent' | 'transparent';
}

/**
 * Компонент кнопки
 * @param props Пропсы кнопки
 * @returns JSX кнопки
 */
export const Button = (props: ButtonProps) => {
  return (
    <div>
      <div
        className={['button', `button__${props.variant ?? 'default'}`]}
        ON_click={props.callback}
      >
        {props.icon !== undefined ? <i class={[props.icon]}></i> : undefined}
        {props.icon !== undefined && props.text !== undefined ? (
          <div style="width: 8px"></div>
        ) : undefined}
        {props.text !== undefined ? props.text : undefined}
      </div>
    </div>
  );
};
