import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "outlined" | "plain";
type ButtonSize = "m" | "s";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

export function Button({
  variant = "outlined",
  size = "m",
  icon,
  iconPosition = "left",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === "s" ? styles.sizeS : null,
    icon ? styles.withIcon : null,
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
    <button className={classes} type={type} {...rest}>
      {iconPosition === "left" ? iconNode : null}
      <span>{children}</span>
      {iconPosition === "right" ? iconNode : null}
    </button>
  );
}
