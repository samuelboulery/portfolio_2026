import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { FinderWindow } from "@/components/windows/FinderWindow";
import { PROJECTS } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("FinderWindow", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
    useWindowStore.getState().openWindow({ id: "finder", type: "finder", title: "Macintosh HD" });
  });

  it("rend un FileIcon par projet + 3 entrées système (CV, Terminal, ASCII)", () => {
    render(<FinderWindow />);
    for (const project of PROJECTS) {
      expect(screen.getByText(project.folderLabel)).toBeInTheDocument();
    }
    expect(screen.getByText("curriculum_vitae.html")).toBeInTheDocument();
    expect(screen.getByText("CommandShell")).toBeInTheDocument();
    expect(screen.getByText("image.ascii")).toBeInTheDocument();
  });

  it("affiche la status bar avec les segments items / disk / available", () => {
    render(<FinderWindow />);
    const expectedItems = `${PROJECTS.length + 3} items`;
    expect(screen.getByText(expectedItems)).toBeInTheDocument();
    expect(screen.getByText(/MB in disk/i)).toBeInTheDocument();
    expect(screen.getByText(/MB available/i)).toBeInTheDocument();
  });

  it("single click sélectionne (data-selected sur le bouton, pas d'autre)", () => {
    render(<FinderWindow />);
    const edf = screen.getByRole("button", { name: PROJECTS[0].folderLabel });
    fireEvent.click(edf);
    expect(edf.getAttribute("data-selected")).toBe("true");
    const mazars = screen.getByRole("button", { name: PROJECTS[1].folderLabel });
    expect(mazars.hasAttribute("data-selected")).toBe(false);
  });

  it("double click ouvre la ProjectWindow correspondante", () => {
    render(<FinderWindow />);
    const edf = screen.getByRole("button", { name: PROJECTS[0].folderLabel });
    fireEvent.doubleClick(edf);
    const opened = useWindowStore.getState().windows[`project:${PROJECTS[0].slug}`];
    expect(opened).toBeDefined();
    expect(opened.isOpen).toBe(true);
  });

  it("double click sur curriculum_vitae.html ouvre la CVWindow", () => {
    render(<FinderWindow />);
    fireEvent.doubleClick(screen.getByRole("button", { name: "curriculum_vitae.html" }));
    expect(useWindowStore.getState().windows.cv?.isOpen).toBe(true);
  });

  it("Macintosh HD est le titre de la fenêtre", () => {
    render(<FinderWindow />);
    expect(screen.getByText("Macintosh HD")).toBeInTheDocument();
  });
});
