import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClickOutside } from "@/hooks/useClickOutside";

describe("useClickOutside", () => {
  let container: HTMLDivElement;
  let outside: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    outside = document.createElement("div");
    document.body.appendChild(container);
    document.body.appendChild(outside);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it("appelle le callback sur clic extérieur", () => {
    const callback = vi.fn();
    const ref = { current: container };
    renderHook(() => useClickOutside(ref, callback));
    act(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas le callback sur clic intérieur", () => {
    const callback = vi.fn();
    const ref = { current: container };
    renderHook(() => useClickOutside(ref, callback));
    act(() => {
      container.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("retire le listener au démontage", () => {
    const callback = vi.fn();
    const ref = { current: container };
    const { unmount } = renderHook(() => useClickOutside(ref, callback));
    unmount();
    act(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("ne plante pas si ref.current est null", () => {
    const callback = vi.fn();
    const ref = { current: null };
    expect(() => {
      const { unmount } = renderHook(() => useClickOutside(ref, callback));
      act(() => {
        outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      });
      unmount();
    }).not.toThrow();
  });
});
