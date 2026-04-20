import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Paragraph } from "@/components/typography/Paragraph";

describe("Paragraph", () => {
  it("rend un <p> par défaut en taille M", () => {
    render(<Paragraph>Contenu</Paragraph>);
    const paragraph = screen.getByText("Contenu");
    expect(paragraph.tagName).toBe("P");
    expect(paragraph.className).toMatch(/paragraph/);
  });

  it("applique la variante muted via tone", () => {
    render(<Paragraph tone="muted">Texte secondaire</Paragraph>);
    expect(screen.getByText("Texte secondaire").className).toMatch(/muted/);
  });

  it("applique la variante mono", () => {
    render(<Paragraph mono>code</Paragraph>);
    expect(screen.getByText("code").className).toMatch(/mono/);
  });

  it("permet de rendre un span via as", () => {
    render(
      <Paragraph as="span" size="s">
        inline
      </Paragraph>,
    );
    expect(screen.getByText("inline").tagName).toBe("SPAN");
  });
});
