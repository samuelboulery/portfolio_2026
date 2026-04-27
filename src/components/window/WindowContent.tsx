import type { ReactNode } from "react";
import { LisaScrollbar } from "@/components/ui/LisaScrollbar";
import styles from "./WindowContent.module.css";

interface WindowContentProps {
  children: ReactNode;
  className?: string;
}

export function WindowContent({ children, className }: WindowContentProps) {
  const viewportClasses = [styles.content, className].filter(Boolean).join(" ");
  return (
    <LisaScrollbar
      orientation="both"
      showResizeCorner
      className={styles.shell}
      viewportClassName={viewportClasses}
    >
      {children}
    </LisaScrollbar>
  );
}
