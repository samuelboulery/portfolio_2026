import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Title.module.css";

type TitleSize = "xl" | "l" | "m" | "s";
type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: TitleTag;
  size?: TitleSize;
  muted?: boolean;
  children: ReactNode;
}

export function Title({
  as = "h2",
  size = "l",
  muted = false,
  className,
  children,
  ...rest
}: TitleProps) {
  const Tag = as as ElementType;
  const classes = [styles.title, styles[size], muted ? styles.muted : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
