import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PowerMenu } from "@/components/os/OSBar/PowerMenu";

describe("PowerMenu", () => {
  it("n'affiche pas le dropdown par défaut", () => {
    const { queryByRole } = render(<PowerMenu onShutdown={vi.fn()} onRestart={vi.fn()} />);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ouvre le dropdown au clic sur le bouton Power", () => {
    const { getByRole, queryByRole } = render(
      <PowerMenu onShutdown={vi.fn()} onRestart={vi.fn()} />,
    );
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("appelle onRestart et ferme le menu sur 'Redémarrer'", () => {
    const onRestart = vi.fn();
    const { getByRole } = render(<PowerMenu onShutdown={vi.fn()} onRestart={onRestart} />);
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    fireEvent.click(getByRole("menuitem", { name: /redémarrer/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("appelle onShutdown et ferme le menu sur 'Éteindre'", () => {
    const onShutdown = vi.fn();
    const { getByRole } = render(<PowerMenu onShutdown={onShutdown} onRestart={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    fireEvent.click(getByRole("menuitem", { name: /éteindre/i }));
    expect(onShutdown).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByRole } = render(<PowerMenu onShutdown={vi.fn()} onRestart={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    expect(document.querySelector("[role='menu']")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });
});
