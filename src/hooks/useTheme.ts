"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "dark" | "retro";

const STORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored === "retro" ? "retro" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "retro" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
