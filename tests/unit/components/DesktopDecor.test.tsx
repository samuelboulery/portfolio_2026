import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { DesktopDecor } from "@/components/folder/DesktopDecor";
import { useWindowStore } from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("DesktopDecor", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("rend Macintosh HD et Trash", () => {
    render(<DesktopDecor />);
    expect(screen.getByRole("button", { name: "Macintosh HD" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Trash" })).toBeInTheDocument();
  });

  it("double click sur Macintosh HD ouvre la fenêtre Finder", () => {
    render(<DesktopDecor />);
    fireEvent.doubleClick(screen.getByRole("button", { name: "Macintosh HD" }));
    const finder = useWindowStore.getState().windows.finder;
    expect(finder).toBeDefined();
    expect(finder.isOpen).toBe(true);
    expect(finder.type).toBe("finder");
  });

  it("Trash est rendu mais pas de target d'action", () => {
    render(<DesktopDecor />);
    const trash = screen.getByRole("button", { name: "Trash" });
    fireEvent.doubleClick(trash);
    expect(useWindowStore.getState().windows.trash).toBeUndefined();
  });
});
