import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Window } from "@/components/window/Window";
import { useWindowStore } from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("Window", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("ne rend rien quand la fenêtre n'est pas dans le store", () => {
    const { container } = render(
      <Window id="ghost">
        <p>contenu</p>
      </Window>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend rien quand la fenêtre est fermée", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    useWindowStore.getState().closeWindow("main");
    const { container } = render(
      <Window id="main">
        <p>contenu</p>
      </Window>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend rien quand la fenêtre est minimisée", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    useWindowStore.getState().minimizeWindow("main");
    const { container } = render(
      <Window id="main">
        <p>contenu</p>
      </Window>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("rend les enfants et le titre passé en props quand la fenêtre est ouverte", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(
      <Window id="main" title="Samuel Boulery">
        <p>Portfolio content</p>
      </Window>,
    );
    expect(screen.getByText("Portfolio content")).toBeInTheDocument();
    expect(screen.getByText("Samuel Boulery")).toBeInTheDocument();
  });

  it("utilise le titre du store si aucun titre n'est passé en props", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main", title: "Titre store" });
    render(
      <Window id="main">
        <p>contenu</p>
      </Window>,
    );
    expect(screen.getByText("Titre store")).toBeInTheDocument();
  });

  it("ferme la fenêtre via le bouton Fermer", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(
      <Window id="main">
        <p>contenu</p>
      </Window>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Fermer la fenêtre" }));
    expect(useWindowStore.getState().windows.main.isOpen).toBe(false);
  });

  it("minimise la fenêtre via le bouton Réduire", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(
      <Window id="main">
        <p>contenu</p>
      </Window>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Réduire la fenêtre" }));
    expect(useWindowStore.getState().windows.main.isMinimized).toBe(true);
  });

  it("ramène la fenêtre au premier plan au mouseDown", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.openWindow({ id: "b", type: "terminal" });
    expect(useWindowStore.getState().order).toEqual(["a", "b"]);

    render(
      <Window id="a" title="Fenêtre A">
        <p>A</p>
      </Window>,
    );
    const titleElement = screen.getByText("Fenêtre A");
    const windowEl = titleElement.closest("[data-variant]");
    expect(windowEl).not.toBeNull();
    fireEvent.mouseDown(windowEl as HTMLElement);
    expect(useWindowStore.getState().order).toEqual(["b", "a"]);
  });

  it("désactive le bouton Agrandir si aucun callback onExpand n'est fourni", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(
      <Window id="main">
        <p>contenu</p>
      </Window>,
    );
    expect(screen.getByRole("button", { name: "Agrandir la fenêtre" })).toBeDisabled();
  });
});
