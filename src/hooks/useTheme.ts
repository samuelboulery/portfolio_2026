"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "retro";

const STORAGE_KEY = "theme";
const VALID_THEMES: readonly Theme[] = ["dark", "light", "retro"];

function isValidTheme(value: string | null): value is Theme {
  return VALID_THEMES.includes(value as Theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: Theme = isValidTheme(stored) ? stored : "dark";
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.theme = next;
  }, []);

  return { theme, setTheme };
}
