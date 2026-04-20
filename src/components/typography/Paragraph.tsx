import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Paragraph.module.css";

type ParagraphSize = "l" | "m" | "s";
type ParagraphTone = "default" | "muted" | "decorative";
type ParagraphTag = "p" | "span" | "div";

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: ParagraphTag;
  size?: ParagraphSize;
  tone?: ParagraphTone;
  mono?: boolean;
  children: ReactNode;
}

export function Paragraph({
  as = "p",
  size = "m",
  tone = "default",
  mono = false,
  className,
  children,
  ...rest
}: ParagraphProps) {
  const Tag = as as ElementType;
  const classes = [
    styles.paragraph,
    styles[size],
    mono ? styles.mono : null,
    tone === "muted" ? styles.muted : null,
    tone === "decorative" ? styles.decorative : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
