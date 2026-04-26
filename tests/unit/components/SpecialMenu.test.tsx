import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SpecialMenu } from "@/components/os/OSBar/SpecialMenu";

describe("SpecialMenu", () => {
  it("ne rend pas le dropdown par défaut", () => {
    const { queryByRole } = render(<SpecialMenu onRestart={vi.fn()} onShutdown={vi.fn()} />);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ouvre le dropdown au clic sur Special", () => {
    const { getByRole, queryByRole } = render(
      <SpecialMenu onRestart={vi.fn()} onShutdown={vi.fn()} />,
    );
    fireEvent.click(getByRole("button", { name: "Special" }));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("Restart appelle onRestart et ferme le menu", () => {
    const onRestart = vi.fn();
    const { getByRole } = render(<SpecialMenu onRestart={onRestart} onShutdown={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: "Special" }));
    fireEvent.click(getByRole("menuitem", { name: "Restart" }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("Shut Down appelle onShutdown et ferme le menu", () => {
    const onShutdown = vi.fn();
    const { getByRole } = render(<SpecialMenu onRestart={vi.fn()} onShutdown={onShutdown} />);
    fireEvent.click(getByRole("button", { name: "Special" }));
    fireEvent.click(getByRole("menuitem", { name: "Shut Down" }));
    expect(onShutdown).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("Sleep est disabled (placeholder)", () => {
    const { getByRole } = render(<SpecialMenu onRestart={vi.fn()} onShutdown={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: "Special" }));
    expect(getByRole("menuitem", { name: "Sleep" })).toBeDisabled();
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByRole } = render(<SpecialMenu onRestart={vi.fn()} onShutdown={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: "Special" }));
    expect(document.querySelector("[role='menu']")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });
});
