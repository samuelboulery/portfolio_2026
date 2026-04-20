import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MEDIA_MOBILE,
  MEDIA_TABLET_AND_BELOW,
  useIsMobile,
  useIsTabletOrBelow,
  useMediaQuery,
} from "@/hooks/useMediaQuery";

type Listener = (event: MediaQueryListEvent) => void;

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  addEventListener: (type: "change", listener: Listener) => void;
  removeEventListener: (type: "change", listener: Listener) => void;
  dispatchChange: (matches: boolean) => void;
}

function createMockMatchMedia(initialMatches = false) {
  const lists = new Map<string, MockMediaQueryList>();

  const implementation = (query: string): MediaQueryList => {
    const listeners = new Set<Listener>();
    const list: MockMediaQueryList = {
      matches: initialMatches,
      media: query,
      addEventListener: (_type, listener) => {
        listeners.add(listener);
      },
      removeEventListener: (_type, listener) => {
        listeners.delete(listener);
      },
      dispatchChange: (matches: boolean) => {
        list.matches = matches;
        const event = { matches, media: query } as MediaQueryListEvent;
        for (const listener of listeners) {
          listener(event);
        }
      },
    };
    lists.set(query, list);
    return list as unknown as MediaQueryList;
  };

  const matchMedia = vi.fn(implementation);

  return {
    matchMedia,
    getList: (query: string) => lists.get(query),
  };
}

function installMatchMedia(mock: ReturnType<typeof createMockMatchMedia>) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: mock.matchMedia,
  });
}

describe("useMediaQuery", () => {
  let mock: ReturnType<typeof createMockMatchMedia>;

  beforeEach(() => {
    mock = createMockMatchMedia();
    installMatchMedia(mock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retourne la valeur initiale de matchMedia après montage", () => {
    const initialTrue = createMockMatchMedia(true);
    installMatchMedia(initialTrue);
    const { result } = renderHook(() => useMediaQuery("(max-width: 500px)"));
    expect(result.current).toBe(true);
  });

  it("met à jour la valeur quand matchMedia déclenche un change", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 800px)"));
    expect(result.current).toBe(false);

    act(() => {
      mock.getList("(max-width: 800px)")?.dispatchChange(true);
    });
    expect(result.current).toBe(true);

    act(() => {
      mock.getList("(max-width: 800px)")?.dispatchChange(false);
    });
    expect(result.current).toBe(false);
  });

  it("retire le listener au démontage", () => {
    const { unmount } = renderHook(() => useMediaQuery("(max-width: 640px)"));
    const list = mock.getList("(max-width: 640px)");
    expect(list).toBeDefined();
    const removeSpy = vi.spyOn(list as MockMediaQueryList, "removeEventListener");
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("useIsTabletOrBelow utilise la media query tablette", () => {
    renderHook(() => useIsTabletOrBelow());
    expect(mock.matchMedia).toHaveBeenCalledWith(MEDIA_TABLET_AND_BELOW);
  });

  it("useIsMobile utilise la media query mobile", () => {
    renderHook(() => useIsMobile());
    expect(mock.matchMedia).toHaveBeenCalledWith(MEDIA_MOBILE);
  });
});
