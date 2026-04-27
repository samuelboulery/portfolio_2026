import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LisaScrollbar } from "@/components/ui/LisaScrollbar";
import { computeThumbGeometry } from "@/components/ui/LisaScrollbar/useScrollbarMetrics";

describe("computeThumbGeometry", () => {
  it("retourne un thumb nul quand il n'y a pas d'overflow", () => {
    const geom = computeThumbGeometry(
      { scrollSize: 100, viewportSize: 100, scrollPos: 0, hasOverflow: false },
      200,
      16,
    );
    expect(geom.size).toBe(0);
    expect(geom.offset).toBe(0);
  });

  it("calcule la taille du thumb proportionnellement au ratio viewport/scroll", () => {
    // viewport 100, scroll 400 → thumb prend 25 % de la track de 200 px = 50 px
    const geom = computeThumbGeometry(
      { scrollSize: 400, viewportSize: 100, scrollPos: 0, hasOverflow: true },
      200,
      16,
    );
    expect(geom.size).toBe(50);
    expect(geom.offset).toBe(0);
  });

  it("respecte la taille minimale du thumb", () => {
    // scroll très grand → thumb naturellement minuscule, on force le min à 16
    const geom = computeThumbGeometry(
      { scrollSize: 100000, viewportSize: 100, scrollPos: 0, hasOverflow: true },
      200,
      16,
    );
    expect(geom.size).toBe(16);
  });

  it("calcule l'offset en fonction de la position de scroll", () => {
    // scroll à mi-chemin → thumb au milieu de la track usable
    const geom = computeThumbGeometry(
      { scrollSize: 400, viewportSize: 100, scrollPos: 150, hasOverflow: true },
      200,
      16,
    );
    // maxScroll = 300, maxOffset = 200-50 = 150 → 150/300 * 150 = 75
    expect(geom.size).toBe(50);
    expect(geom.offset).toBe(75);
  });
});

describe("LisaScrollbar", () => {
  it("rend une barre verticale (track + 2 flèches) quand orientation='vertical'", () => {
    render(
      <LisaScrollbar orientation="vertical">
        <p>contenu</p>
      </LisaScrollbar>,
    );
    expect(screen.getByTestId("lisa-scrollbar-vertical")).toBeInTheDocument();
    expect(screen.queryByTestId("lisa-scrollbar-horizontal")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Défiler vers le haut")).toBeInTheDocument();
    expect(screen.getByLabelText("Défiler vers le bas")).toBeInTheDocument();
  });

  it("rend une barre horizontale quand orientation='horizontal'", () => {
    render(
      <LisaScrollbar orientation="horizontal">
        <p>contenu</p>
      </LisaScrollbar>,
    );
    expect(screen.getByTestId("lisa-scrollbar-horizontal")).toBeInTheDocument();
    expect(screen.queryByTestId("lisa-scrollbar-vertical")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Défiler vers la gauche")).toBeInTheDocument();
    expect(screen.getByLabelText("Défiler vers la droite")).toBeInTheDocument();
  });

  it("rend les deux axes + le coin de redim quand orientation='both' et showResizeCorner", () => {
    const { container } = render(
      <LisaScrollbar orientation="both" showResizeCorner>
        <p>contenu</p>
      </LisaScrollbar>,
    );
    expect(screen.getByTestId("lisa-scrollbar-vertical")).toBeInTheDocument();
    expect(screen.getByTestId("lisa-scrollbar-horizontal")).toBeInTheDocument();
    expect(container.querySelector('[data-has-corner="true"]')).not.toBeNull();
  });

  it("appelle scrollBy sur le viewport au clic flèche bas", () => {
    const { container } = render(
      <LisaScrollbar orientation="vertical">
        <p>contenu long</p>
      </LisaScrollbar>,
    );
    // Le viewport est le premier enfant du wrapper qui n'est pas un élément aria
    const viewport = container.querySelector('[class*="viewport"]') as HTMLElement | null;
    expect(viewport).not.toBeNull();
    if (!viewport) throw new Error("viewport introuvable");
    const scrollBy = vi.fn();
    viewport.scrollBy = scrollBy as typeof viewport.scrollBy;

    const downButton = screen.getByLabelText("Défiler vers le bas");
    fireEvent.pointerDown(downButton, { button: 0, pointerId: 1 });
    fireEvent.pointerUp(downButton, { pointerId: 1 });

    expect(scrollBy).toHaveBeenCalledWith({ top: 24 });
  });
});
