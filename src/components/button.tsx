interface ButtonProps {
  text?: string;
  icon?: string;
  callback?: (event: PointerEvent) => void;
}

export const ButtonComponent = (props: ButtonProps = {}) => {
  return (
    <div class="button" style="cursor:pointer">
      {props.icon !== undefined ? (
        <i
          class={[props.icon]}
          style="margin-right: auto; margin-left: auto;height: 16px; margin-bottom: 7px;"
        ></i>
      ) : undefined}
    </div>
  );
};
