"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Le portfolio expose un seul thème actif : Mac Lisa (1-bit pur).
 * L'infrastructure `setTheme` est conservée pour réintroduire d'autres
 * thèmes (ex. "phosphor" CRT vert) sans toucher aux composants.
 */
export type Theme = "lisa";

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "lisa";
const VALID_THEMES: readonly Theme[] = ["lisa"];

function isValidTheme(value: string | null): value is Theme {
  return VALID_THEMES.includes(value as Theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: Theme = isValidTheme(stored) ? stored : DEFAULT_THEME;
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
