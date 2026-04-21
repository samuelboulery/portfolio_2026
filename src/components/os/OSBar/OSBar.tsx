"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { formatOsBarDate } from "@/lib/formatDate";
import { PowerMenu } from "./PowerMenu";
import { TopMenuBar } from "./TopMenuBar";
import styles from "./OSBar.module.css";

const THEME_LABELS = {
  dark: "Sombre",
  light: "Clair",
  retro: "Rétro",
} as const;

interface OSBarProps {
  onShutdown: () => void;
  onRestart: () => void;
}

export function OSBar({ onShutdown, onRestart }: OSBarProps) {
  const [now, setNow] = useState<Date | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <PowerMenu onShutdown={onShutdown} onRestart={onRestart} />
        <span className={styles.separator} aria-hidden="true" />
        <TopMenuBar setTheme={setTheme} currentTheme={theme} />
      </div>
      <div className={styles.right}>
        <span className={styles.themeLabel}>{THEME_LABELS[theme]}</span>
        <span className={styles.time} suppressHydrationWarning>
          {now ? formatOsBarDate(now) : ""}
        </span>
      </div>
    </header>
  );
}
