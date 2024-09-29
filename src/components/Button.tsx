import { noop } from '/utils/noop.js';

interface ButtonProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
}

export const ButtonComponent = (props: ButtonProps = {}) => {
  return (
    <div>
      <div class="button" ON_click={props.callback ?? noop}>
        {props.icon !== undefined ? <i class={[props.icon]}></i> : undefined}
        {props.icon !== undefined && props.text !== undefined ? (
          <div class="w-8px"></div>
        ) : undefined}
        {props.text !== undefined ? props.text : undefined}
      </div>
    </div>
  );
};
