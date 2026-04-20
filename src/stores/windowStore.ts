import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WindowType = "main" | "subtitle" | "terminal" | "image" | "cv" | "project";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowConfig {
  id: string;
  type: WindowType;
  title?: string;
  initialPosition?: WindowPosition;
  meta?: Readonly<Record<string, unknown>>;
}

export interface WindowState {
  id: string;
  type: WindowType;
  title?: string;
  position: WindowPosition;
  isOpen: boolean;
  isMinimized: boolean;
  meta?: Readonly<Record<string, unknown>>;
}

interface WindowStoreState {
  windows: Readonly<Record<string, WindowState>>;
  order: readonly string[];
}

interface WindowStoreActions {
  openWindow: (config: WindowConfig) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: WindowPosition) => void;
}

export type WindowStore = WindowStoreState & WindowStoreActions;

const DEFAULT_POSITION: WindowPosition = { x: 0, y: 0 };

function bringToFront(order: readonly string[], id: string): string[] {
  return [...order.filter((entry) => entry !== id), id];
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set) => ({
      windows: {},
      order: [],
      openWindow: (config) =>
        set((state) => {
          const existing = state.windows[config.id];
          const position = existing?.position ?? config.initialPosition ?? DEFAULT_POSITION;
          const next: WindowState = existing
            ? { ...existing, isOpen: true, isMinimized: false }
            : {
                id: config.id,
                type: config.type,
                title: config.title,
                position,
                isOpen: true,
                isMinimized: false,
                meta: config.meta,
              };
          return {
            windows: { ...state.windows, [config.id]: next },
            order: bringToFront(state.order, config.id),
          };
        }),
      closeWindow: (id) =>
        set((state) => {
          const existing = state.windows[id];
          if (!existing) return state;
          return {
            windows: {
              ...state.windows,
              [id]: { ...existing, isOpen: false, isMinimized: false },
            },
            order: state.order.filter((entry) => entry !== id),
          };
        }),
      minimizeWindow: (id) =>
        set((state) => {
          const existing = state.windows[id];
          if (!existing) return state;
          return {
            windows: {
              ...state.windows,
              [id]: { ...existing, isMinimized: true },
            },
            order: state.order.filter((entry) => entry !== id),
          };
        }),
      restoreWindow: (id) =>
        set((state) => {
          const existing = state.windows[id];
          if (!existing) return state;
          return {
            windows: {
              ...state.windows,
              [id]: { ...existing, isOpen: true, isMinimized: false },
            },
            order: bringToFront(state.order, id),
          };
        }),
      focusWindow: (id) =>
        set((state) => {
          if (!state.windows[id]) return state;
          if (state.order[state.order.length - 1] === id) return state;
          return { order: bringToFront(state.order, id) };
        }),
      updatePosition: (id, position) =>
        set((state) => {
          const existing = state.windows[id];
          if (!existing) return state;
          return {
            windows: {
              ...state.windows,
              [id]: { ...existing, position },
            },
          };
        }),
    }),
    {
      name: "portfolio_2026:windows",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return window.sessionStorage;
      }),
      partialize: (state) => ({ windows: state.windows, order: state.order }),
    },
  ),
);

export function selectWindow(id: string) {
  return (state: WindowStore): WindowState | undefined => state.windows[id];
}

export function selectZIndex(id: string) {
  return (state: WindowStore): number => {
    const idx = state.order.indexOf(id);
    return idx === -1 ? 100 : 100 + idx;
  };
}

export function selectFocusedId(state: WindowStore): string | null {
  return state.order.length === 0 ? null : state.order[state.order.length - 1];
}

export function selectIsFocused(id: string) {
  return (state: WindowStore): boolean => selectFocusedId(state) === id;
}
