import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("rend un bouton de type 'button' par défaut", () => {
    render(<Button>Go</Button>);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toMatch(/outlined/);
  });

  it("applique la variante plain", () => {
    render(<Button variant="plain">Valider</Button>);
    expect(screen.getByRole("button", { name: "Valider" }).className).toMatch(/plain/);
  });

  it("applique la taille s", () => {
    render(
      <Button size="s" variant="outlined">
        Petit
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Petit" }).className).toMatch(/sizeS/);
  });

  it("rend une icône quand fournie et la masque aux lecteurs d'écran", () => {
    render(<Button icon={<svg data-testid="icon" />}>Télécharger</Button>);
    const iconWrapper = screen.getByTestId("icon").parentElement;
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("déclenche onClick au clic", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Cliquer</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Cliquer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respecte l'état disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Off
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Off" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
