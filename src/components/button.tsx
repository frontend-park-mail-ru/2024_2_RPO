import { noop } from '/utils/noop.js';

interface ButtonProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
}

export const ButtonComponent = (props: ButtonProps = {}) => {
  return (
    <div
      class="button"
      style="cursor:pointer"
      ON_click={props.callback ?? noop}
    >
      {props.icon !== undefined ? (
        <i
          class={[props.icon]}
          style="margin-right: auto; margin-left: auto;height: 16px; margin-bottom: 7px;"
        ></i>
      ) : undefined}
      {props.text !== undefined ? props.text : undefined}
    </div>
  );
};
