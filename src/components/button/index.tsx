import clsx from "clsx";
import { FC } from "react";
import styles from "./style.module.scss";

type Props = {
  type?: "submit" | "button" | "reset";
  variant?: "contained" | "outlined";
  size?: "normal" | "small";
  onClick?: () => void;
  disabled?: boolean;
};

export const Button: FC<Props> = (props) => {
  const { type, variant, size, onClick, children, disabled } = props;

  return (
    <button
      className={clsx(styles.button, {
        [styles.outlined]: variant === "outlined",
        [styles.small]: size === "small",
        [styles.disabled]: disabled,
      })}
      type={type || "submit"}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
