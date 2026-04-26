import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinderIcon, type FinderIconKind } from "@/components/ui/icons/FinderIcon";

const ALL_KINDS: ReadonlyArray<FinderIconKind> = [
  "folder",
  "folder-selected",
  "document",
  "executable",
  "application",
  "hd",
  "trash",
  "warning",
  "apple",
  "close-box",
  "zoom-box",
  "grow-box",
];

describe("FinderIcon", () => {
  it("rend un SVG pour chaque kind connu et expose data-icon-kind", () => {
    for (const kind of ALL_KINDS) {
      const { container, unmount } = render(<FinderIcon kind={kind} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg?.getAttribute("data-icon-kind")).toBe(kind);
      unmount();
    }
  });

  it("applique la taille demandée via inline style", () => {
    const { container } = render(<FinderIcon kind="folder" size={64} />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.width).toBe("64px");
    expect(svg.style.height).toBe("64px");
  });

  it("expose data-pressed quand pressed est true et l'omet sinon", () => {
    const { container, rerender } = render(<FinderIcon kind="close-box" />);
    expect(container.querySelector("svg")?.hasAttribute("data-pressed")).toBe(false);

    rerender(<FinderIcon kind="close-box" pressed />);
    expect(container.querySelector("svg")?.getAttribute("data-pressed")).toBe("true");
  });

  it("rend un title accessible quand title est fourni", () => {
    const { container } = render(<FinderIcon kind="apple" title="Menu Apple" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Menu Apple");
    expect(container.querySelector("title")?.textContent).toBe("Menu Apple");
  });

  it("est aria-hidden par défaut (rôle décoratif)", () => {
    const { container } = render(<FinderIcon kind="folder" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBe("presentation");
  });

  it("propage la className externe", () => {
    const { container } = render(<FinderIcon kind="folder" className="custom" />);
    expect(container.querySelector("svg")?.classList.contains("custom")).toBe(true);
  });
});
