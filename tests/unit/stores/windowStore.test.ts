import { beforeEach, describe, expect, it } from "vitest";
import {
  selectFocusedId,
  selectIsFocused,
  selectZIndex,
  useWindowStore,
} from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("windowStore", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("ouvre une fenêtre avec sa position initiale", () => {
    useWindowStore.getState().openWindow({
      id: "main",
      type: "main",
      initialPosition: { x: 120, y: 80 },
    });
    const state = useWindowStore.getState();
    expect(state.windows.main).toBeDefined();
    expect(state.windows.main.isOpen).toBe(true);
    expect(state.windows.main.isMinimized).toBe(false);
    expect(state.windows.main.position).toEqual({ x: 120, y: 80 });
    expect(state.order).toEqual(["main"]);
  });

  it("remet la fenêtre au premier plan à la réouverture", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.openWindow({ id: "b", type: "terminal" });
    store.openWindow({ id: "a", type: "main" });
    expect(useWindowStore.getState().order).toEqual(["b", "a"]);
  });

  it("close retire la fenêtre de l'ordre mais garde sa position", () => {
    const store = useWindowStore.getState();
    store.openWindow({
      id: "main",
      type: "main",
      initialPosition: { x: 10, y: 20 },
    });
    store.closeWindow("main");
    const state = useWindowStore.getState();
    expect(state.windows.main.isOpen).toBe(false);
    expect(state.windows.main.position).toEqual({ x: 10, y: 20 });
    expect(state.order).toEqual([]);
  });

  it("minimize retire de l'ordre et flagge isMinimized", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.openWindow({ id: "b", type: "terminal" });
    store.minimizeWindow("a");
    const state = useWindowStore.getState();
    expect(state.windows.a.isMinimized).toBe(true);
    expect(state.windows.a.isOpen).toBe(true);
    expect(state.order).toEqual(["b"]);
  });

  it("restore ramène une fenêtre minimisée au premier plan", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.openWindow({ id: "b", type: "terminal" });
    store.minimizeWindow("a");
    store.restoreWindow("a");
    const state = useWindowStore.getState();
    expect(state.windows.a.isMinimized).toBe(false);
    expect(state.order).toEqual(["b", "a"]);
  });

  it("focus déplace l'id en tête de pile", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.openWindow({ id: "b", type: "terminal" });
    store.openWindow({ id: "c", type: "cv" });
    store.focusWindow("a");
    expect(useWindowStore.getState().order).toEqual(["b", "c", "a"]);
  });

  it("focus ignore un id inconnu", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.focusWindow("ghost");
    expect(useWindowStore.getState().order).toEqual(["a"]);
  });

  it("updatePosition met à jour uniquement la position ciblée", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main", initialPosition: { x: 0, y: 0 } });
    store.updatePosition("a", { x: 100, y: 200 });
    expect(useWindowStore.getState().windows.a.position).toEqual({ x: 100, y: 200 });
  });

  it("selectZIndex retourne 100 + rang dans order", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.openWindow({ id: "b", type: "terminal" });
    store.openWindow({ id: "c", type: "cv" });
    const state = useWindowStore.getState();
    expect(selectZIndex("a")(state)).toBe(100);
    expect(selectZIndex("b")(state)).toBe(101);
    expect(selectZIndex("c")(state)).toBe(102);
    expect(selectZIndex("ghost")(state)).toBe(100);
  });

  it("selectFocusedId retourne l'id au sommet de la pile", () => {
    const store = useWindowStore.getState();
    store.openWindow({ id: "a", type: "main" });
    store.openWindow({ id: "b", type: "terminal" });
    expect(selectFocusedId(useWindowStore.getState())).toBe("b");
    expect(selectIsFocused("b")(useWindowStore.getState())).toBe(true);
    expect(selectIsFocused("a")(useWindowStore.getState())).toBe(false);
  });

  it("selectFocusedId renvoie null quand rien n'est ouvert", () => {
    expect(selectFocusedId(useWindowStore.getState())).toBeNull();
  });
});
