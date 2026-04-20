import type { ReactNode } from "react";
import styles from "./WindowContent.module.css";

interface WindowContentProps {
  children: ReactNode;
  className?: string;
}

export function WindowContent({ children, className }: WindowContentProps) {
  const classes = [styles.content, className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
