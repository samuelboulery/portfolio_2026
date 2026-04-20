import type { ReactNode } from "react";
import styles from "./Desktop.module.css";

interface DesktopProps {
  children?: ReactNode;
}

export function Desktop({ children }: DesktopProps) {
  return (
    <div className={styles.desktop}>
      <main className={styles.scene}>
        <div className={styles.windowsLayer}>{children}</div>
      </main>
    </div>
  );
}
