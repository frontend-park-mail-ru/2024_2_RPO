interface ButtonProps {
  text?: string;
  icon?: string;
  callback?: Function;
}

export const ButtonComponent = (props?: ButtonProps) => {
  const btnProps = props ?? {};
  return (
    <div class="button" style="cursor:pointer; position: relative;">
      <i
        class={[btnProps.icon]}
        style="margin-right: auto; margin-left: auto;height: 16px; margin-bottom: 7px;"
      ></i>
    </div>
  );
};
