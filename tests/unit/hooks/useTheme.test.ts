import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useTheme } from "@/hooks/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("retourne 'lisa' par défaut", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("lisa");
  });

  it("applique data-theme='lisa' sur <html> au montage", async () => {
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(document.documentElement.dataset.theme).toBe("lisa");
    expect(result.current.theme).toBe("lisa");
  });

  it("setTheme('lisa') persiste en localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("lisa"));
    expect(localStorage.getItem("theme")).toBe("lisa");
  });

  it("setTheme applique data-theme sur <html>", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("lisa"));
    expect(document.documentElement.dataset.theme).toBe("lisa");
  });

  it("ignore une valeur localStorage invalide et retombe sur 'lisa'", async () => {
    localStorage.setItem("theme", "banana");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("lisa");
  });

  it("ignore les anciens thèmes (dark/light/retro) et retombe sur 'lisa'", async () => {
    localStorage.setItem("theme", "retro");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("lisa");
  });
});
