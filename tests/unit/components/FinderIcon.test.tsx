import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinderIcon, type FinderIconKind } from "@/components/ui/icons/FinderIcon";

const ASSET_KINDS: ReadonlyArray<FinderIconKind> = [
  "folder",
  "folder-selected",
  "document",
  "executable",
  "application",
  "clipboard",
];

const INLINE_KINDS: ReadonlyArray<FinderIconKind> = [
  "hd",
  "trash",
  "warning",
  "apple",
  "close-box",
  "zoom-box",
  "grow-box",
];

describe("FinderIcon — kinds asset-based (img)", () => {
  it("rend un <img> pour chaque kind asset et expose data-icon-kind + src attendu", () => {
    for (const kind of ASSET_KINDS) {
      const { container, unmount } = render(<FinderIcon kind={kind} />);
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(container.querySelector("svg")).toBeNull();
      expect(img?.getAttribute("data-icon-kind")).toBe(kind);
      expect(img?.getAttribute("src")).toBe(`/icons/finder/${kind}.svg`);
      unmount();
    }
  });

  it("calcule width/height proportionnels au ratio (folder paysage)", () => {
    const { container } = render(<FinderIcon kind="folder" size={40} />);
    const img = container.querySelector("img");
    // ratio 94.25 / 76.125 ≈ 1.238 → landscape : width=size, height=size/ratio
    expect(Number(img?.getAttribute("width"))).toBe(40);
    expect(Number(img?.getAttribute("height"))).toBeCloseTo(40 / (94.25 / 76.125), 2);
  });

  it("calcule width/height proportionnels au ratio (document portrait)", () => {
    const { container } = render(<FinderIcon kind="document" size={40} />);
    const img = container.querySelector("img");
    // ratio 79.75 / 101.5 ≈ 0.786 → portrait : width=size*ratio, height=size
    expect(Number(img?.getAttribute("width"))).toBeCloseTo(40 * (79.75 / 101.5), 2);
    expect(Number(img?.getAttribute("height"))).toBe(40);
  });

  it("relaie title vers alt et lève aria-hidden quand title est défini", () => {
    const { container } = render(<FinderIcon kind="folder" title="Dossier projet" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("Dossier projet");
    expect(img?.getAttribute("aria-hidden")).toBeNull();
  });

  it("est aria-hidden par défaut (rôle décoratif)", () => {
    const { container } = render(<FinderIcon kind="folder" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.getAttribute("alt")).toBe("");
  });

  it("propage la className externe", () => {
    const { container } = render(<FinderIcon kind="folder" className="custom" />);
    expect(container.querySelector("img")?.classList.contains("custom")).toBe(true);
  });
});

describe("FinderIcon — kinds inline (svg)", () => {
  it("rend un <svg> pour chaque kind inline et expose data-icon-kind", () => {
    for (const kind of INLINE_KINDS) {
      const { container, unmount } = render(<FinderIcon kind={kind} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(container.querySelector("img")).toBeNull();
      expect(svg?.getAttribute("data-icon-kind")).toBe(kind);
      unmount();
    }
  });

  it("applique la taille demandée via inline style", () => {
    const { container } = render(<FinderIcon kind="trash" size={64} />);
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
    const { container } = render(<FinderIcon kind="trash" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBe("presentation");
  });

  it("propage la className externe", () => {
    const { container } = render(<FinderIcon kind="trash" className="custom" />);
    expect(container.querySelector("svg")?.classList.contains("custom")).toBe(true);
  });
});
