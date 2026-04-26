import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BootScreen } from "@/components/os/BootScreen/BootScreen";

const BOOT_DURATION_MS = 1800;

describe("BootScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("affiche 'Welcome to Macintosh'", async () => {
    const onDone = vi.fn();
    const { getByText } = await act(async () => render(<BootScreen onDone={onDone} />));
    expect(getByText("Welcome to Macintosh")).toBeInTheDocument();
  });

  it("affiche le Happy Mac", async () => {
    const onDone = vi.fn();
    const { getByTitle } = await act(async () => render(<BootScreen onDone={onDone} />));
    expect(getByTitle("Macintosh")).toBeInTheDocument();
  });

  it("appelle onDone après la durée de boot", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    expect(onDone).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(BOOT_DURATION_MS);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("écrit sessionStorage après onDone", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    await act(async () => {
      vi.advanceTimersByTime(BOOT_DURATION_MS);
    });
    expect(sessionStorage.getItem("boot-done")).toBe("1");
  });

  it("appelle onDone immédiatement si sessionStorage contient boot-done", async () => {
    sessionStorage.setItem("boot-done", "1");
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("appelle onDone sur clic", async () => {
    const onDone = vi.fn();
    const { container } = await act(async () => render(<BootScreen onDone={onDone} />));
    fireEvent.click(container.firstChild as Element);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("appelle onDone sur keydown", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onDone deux fois si clic puis timer", async () => {
    const onDone = vi.fn();
    const { container } = await act(async () => render(<BootScreen onDone={onDone} />));
    fireEvent.click(container.firstChild as Element);
    expect(onDone).toHaveBeenCalledTimes(1);
    await act(async () => {
      vi.advanceTimersByTime(BOOT_DURATION_MS);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
