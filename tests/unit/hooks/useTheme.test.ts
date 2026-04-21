import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Theme, useTheme } from "@/hooks/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("retourne 'dark' par défaut", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("lit 'retro' depuis localStorage au montage", async () => {
    localStorage.setItem("theme", "retro");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("retro");
  });

  it("lit 'light' depuis localStorage au montage", async () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("light");
  });

  it("setTheme persiste en localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("light"));
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("setTheme applique data-theme sur <html>", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("retro"));
    expect(document.documentElement.dataset.theme).toBe("retro");
  });

  it("setTheme met à jour le state React", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("light"));
    expect(result.current.theme).toBe("light");
  });

  it("ignore une valeur localStorage invalide et retombe sur 'dark'", async () => {
    localStorage.setItem("theme", "banana");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("dark");
  });
});
