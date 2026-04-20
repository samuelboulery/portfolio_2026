import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Title } from "@/components/typography/Title";

describe("Title", () => {
  it("rend un h2 par défaut avec taille L", () => {
    render(<Title>Bonjour</Title>);
    const heading = screen.getByRole("heading", { level: 2, name: "Bonjour" });
    expect(heading).toBeInTheDocument();
  });

  it("respecte le prop as pour changer le niveau sémantique", () => {
    render(
      <Title as="h1" size="xl">
        Titre principal
      </Title>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Titre principal");
  });

  it("applique la variante muted quand demandé", () => {
    render(<Title muted>Texte atténué</Title>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toMatch(/muted/);
  });

  it("fusionne une className externe", () => {
    render(<Title className="custom-class">Titre</Title>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("custom-class");
  });
});
