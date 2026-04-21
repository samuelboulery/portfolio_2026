import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShutdownScreen } from "@/components/os/ShutdownScreen/ShutdownScreen";

describe("ShutdownScreen", () => {
  it("s'affiche avec le message d'arrêt", () => {
    const { getByTestId } = render(<ShutdownScreen onRestart={vi.fn()} />);
    expect(getByTestId("shutdown-screen")).toBeInTheDocument();
  });

  it("affiche les lignes CRT", () => {
    const { getByText } = render(<ShutdownScreen onRestart={vi.fn()} />);
    expect(getByText(/Système arrêté/)).toBeInTheDocument();
    expect(getByText(/cliquez n'importe où/)).toBeInTheDocument();
  });

  it("appelle onRestart sur clic", () => {
    const onRestart = vi.fn();
    const { getByTestId } = render(<ShutdownScreen onRestart={onRestart} />);
    fireEvent.click(getByTestId("shutdown-screen"));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("appelle onRestart sur keydown", async () => {
    const onRestart = vi.fn();
    await act(async () => {
      render(<ShutdownScreen onRestart={onRestart} />);
    });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onRestart deux fois si clic puis keydown", () => {
    const onRestart = vi.fn();
    const { getByTestId } = render(<ShutdownScreen onRestart={onRestart} />);
    fireEvent.click(getByTestId("shutdown-screen"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onRestart).toHaveBeenCalledTimes(2);
  });
});
