import { ComponentProps } from '@/jsxCore/types';

interface ButtonProps extends ComponentProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
  variant?: 'default' | 'negative' | 'positive' | 'accent' | 'transparent';
  fullWidth?: true; // Флаг; указывает, должна ли кнопка принимать ширину родителя
}

/**
 * Компонент кнопки
 * @param props Пропсы кнопки
 * @returns JSX кнопки
 */
export const Button = (props: ButtonProps) => {
  console.log('Full width: ', JSON.stringify(props.fullWidth));
  return (
    <div>
      <div
        className={['button', `button__${props.variant ?? 'default'}`]}
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
