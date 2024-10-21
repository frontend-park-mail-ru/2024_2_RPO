import { ComponentProps } from '@/jsxCore/types';

interface ButtonProps extends ComponentProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
  variant?: 'default' | 'negative' | 'positive' | 'accent' | 'transparent';
}

const colorMap: Record<string, string> = {
  default: '#F6F5FA',
  negative: '#ED330A',
  positive: '#0DC268',
  accent: '#0070F0',
  transparent: '#C15DF3',

  // grey: '#EAEBEE',
  // cornflower: '#B4C0EE',
};

/**
 * Компонент кнопки
 * @param props Пропсы кнопки
 * @returns JSX кнопки
 */
export const Button = (props: ButtonProps) => {
  const backgroundColor = props.variant ? colorMap[props.variant] : '#F6F5FA'; // Цвет по умолчанию — белый

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
