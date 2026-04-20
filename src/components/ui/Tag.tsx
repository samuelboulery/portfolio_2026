import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Tag.module.css";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Tag({ className, children, ...rest }: TagProps) {
  const classes = [styles.tag, className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
