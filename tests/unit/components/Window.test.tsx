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

  it("expose deux widgets dans la title bar : close à gauche, zoom à droite", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(
      <Window id="main" title="Fenêtre">
        <p>contenu</p>
      </Window>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    const close = screen.getByRole("button", { name: "Fermer la fenêtre" });
    const zoom = screen.getByRole("button", { name: "Agrandir la fenêtre" });
    const titleEl = screen.getByText("Fenêtre");
    // close avant titre, zoom après titre
    expect(close.compareDocumentPosition(titleEl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(zoom.compareDocumentPosition(titleEl) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it("désactive le bouton Agrandir si aucun callback onZoom n'est fourni", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(
      <Window id="main">
        <p>contenu</p>
      </Window>,
    );
    expect(screen.getByRole("button", { name: "Agrandir la fenêtre" })).toBeDisabled();
  });

  it("propage data-focused sur la title bar selon l'état du store", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main", title: "Titre A" });
    store.openWindow({ id: "b", type: "terminal", title: "Titre B" });
    // b est focused (dernier ouvert), a non focused
    render(
      <>
        <Window id="a" title="Titre A">
          <p>contenu A</p>
        </Window>
        <Window id="b" title="Titre B">
          <p>contenu B</p>
        </Window>
      </>,
    );
    const aBar = screen.getByText("Titre A").closest("[data-focused]");
    const bBar = screen.getByText("Titre B").closest("[data-focused]");
    expect(aBar?.getAttribute("data-focused")).toBe("false");
    expect(bBar?.getAttribute("data-focused")).toBe("true");
  });
});
