"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export const MEDIA_MOBILE = "(max-width: 639px)";
export const MEDIA_TABLET_AND_BELOW = "(max-width: 1023px)";

export function useIsTabletOrBelow(): boolean {
  return useMediaQuery(MEDIA_TABLET_AND_BELOW);
}

export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA_MOBILE);
}
