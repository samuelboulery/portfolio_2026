import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WindowStatusBar } from "@/components/window/WindowStatusBar";

describe("WindowStatusBar", () => {
  it("rend chaque segment textuel reçu en prop", () => {
    render(<WindowStatusBar segments={["10 items", "4.7 MB in disk", "481.5 MB available"]} />);
    expect(screen.getByText("10 items")).toBeInTheDocument();
    expect(screen.getByText("4.7 MB in disk")).toBeInTheDocument();
    expect(screen.getByText("481.5 MB available")).toBeInTheDocument();
  });

  it("ne rend rien quand le tableau de segments est vide", () => {
    const { container } = render(<WindowStatusBar segments={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("expose un aria-label décrivant les segments", () => {
    render(<WindowStatusBar segments={["10 items", "4.7 MB in disk"]} />);
    expect(screen.getByLabelText("Fenêtre : 10 items, 4.7 MB in disk")).toBeInTheDocument();
  });

  it("fusionne une className externe", () => {
    const { container } = render(<WindowStatusBar segments={["x"]} className="custom-bar" />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toMatch(/custom-bar/);
  });
});
