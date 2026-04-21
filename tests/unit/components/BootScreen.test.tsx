import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BootScreen } from "@/components/os/BootScreen/BootScreen";

// framer-motion fonctionne en jsdom sans mock — motion.div rend normalement
// mais les animations CSS ne jouent pas. On teste le comportement, pas l'animation.

const LINE_COUNT = 7; // nombre de lignes dans BOOT_LINES
const LINE_DELAY_MS = 400;
const POST_DELAY_MS = 600;
const TOTAL_MS = LINE_COUNT * LINE_DELAY_MS + POST_DELAY_MS;

describe("BootScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("appelle onDone après la séquence complète", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    expect(onDone).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(TOTAL_MS);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("écrit sessionStorage après onDone", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    await act(async () => {
      vi.advanceTimersByTime(TOTAL_MS);
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

  it("appelle onDone sur keydown (n'importe quelle touche)", async () => {
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
      vi.advanceTimersByTime(TOTAL_MS);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("affiche toutes les lignes de boot", async () => {
    const onDone = vi.fn();
    const { getByText } = await act(async () => render(<BootScreen onDone={onDone} />));
    expect(getByText(/Portfolio OS 2026/)).toBeInTheDocument();
    expect(getByText(/Booting imagination/)).toBeInTheDocument();
    expect(getByText(/Warming up coffee/)).toBeInTheDocument();
    expect(getByText(/Ready/)).toBeInTheDocument();
  });
});
