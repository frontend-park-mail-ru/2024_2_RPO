import { ComponentProps } from '@/jsxCore/types';
import './button.scss';
interface ButtonProps extends ComponentProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
  variant?: 'default' | 'negative' | 'positive' | 'accent' | 'transparent';
  extraRounded?: boolean;
  fullWidth?: true; // Флаг; указывает, должна ли кнопка принимать ширину родителя
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
        className={[
          'button',
          `button__${props.variant ?? 'default'}`,
          props.extraRounded && 'button__extra-rounded',
        ]}
        style={props.fullWidth === true ? 'width: 100%' : ''}
        ON_click={props.callback}
      >
        {props.icon !== undefined ? (
          <i className={[props.icon, 'button__icon']}></i>
        ) : undefined}
        {props.icon !== undefined && props.text !== undefined ? (
          <div style="width: 8px"></div>
        ) : undefined}
        {props.text !== undefined ? props.text : undefined}
      </div>
    </div>
  );
};
