import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "outlined" | "plain";
type ButtonSize = "m" | "s";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  defaultRing?: boolean;
  fixedMinWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
  children: ReactNode;
}

export function Button({
  variant = "outlined",
  size = "m",
  icon,
  iconPosition = "left",
  defaultRing = false,
  fixedMinWidth = false,
  className,
  children,
  type = "button",
  ref,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === "s" ? styles.sizeS : null,
    icon ? styles.withIcon : null,
    defaultRing ? styles.defaultRing : null,
    fixedMinWidth ? styles.fixedMinWidth : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconNode = icon ? (
    <span aria-hidden="true" className={styles.icon}>
      {icon}
    </span>
  ) : null;

  return (
    <button
      className={classes}
      type={type}
      ref={ref}
      data-default={defaultRing || undefined}
      {...rest}
    >
      {iconPosition === "left" ? iconNode : null}
      <span>{children}</span>
      {iconPosition === "right" ? iconNode : null}
    </button>
  );
}
