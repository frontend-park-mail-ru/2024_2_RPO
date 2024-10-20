import { ComponentProps } from '@/jsxCore/types';

interface ButtonProps extends ComponentProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
  color?: 'white' | 'grey' | 'green' | 'red' | 'blue' | 'cornflower' | 'violet';
}

const colorMap: Record<string, string> = {
  white: '#F6F5FA',
  grey: '#EAEBEE',
  green: '#0DC268',
  red: '#ED330A',
  blue: '#0070F0',
  cornflower: '#B4C0EE',
  violet: '#C15DF3',
};

/**
 * Компонент кнопки
 * @param props Пропсы кнопки
 * @returns JSX кнопки
 */
export const Button = (props: ButtonProps) => {
  const backgroundColor = props.color ? colorMap[props.color] : '#F6F5FA'; // Цвет по умолчанию — белый

  return (
    <div>
      <div class="button" ON_click={props.callback} style={{ backgroundColor }}>
        {props.icon !== undefined ? <i class={[props.icon]}></i> : undefined}
        {props.icon !== undefined && props.text !== undefined ? (
          <div style="width: 8px"></div>
        ) : undefined}
        {props.text !== undefined ? props.text : undefined}
      </div>
    </div>
  );
};
