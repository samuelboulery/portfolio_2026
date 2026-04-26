import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TerminalWindow } from "@/components/windows/TerminalWindow";
import { EXTERNAL_LINKS, PROJECTS, projectWindowId } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("TerminalWindow", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("affiche le prompt ls et la liste des lignes cliquables", () => {
    useWindowStore.getState().openWindow({ id: "terminal", type: "terminal" });
    render(<TerminalWindow />);
    expect(screen.getByText("ls")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /linkedin\.url/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /curriculum_vitae\.html/ })).toBeInTheDocument();
    for (const project of PROJECTS) {
      expect(
        screen.getByRole("button", { name: `Ouvrir ${project.terminalLine}` }),
      ).toBeInTheDocument();
    }
  });

  it("ouvre la fenêtre CV au click sur curriculum_vitae.html", () => {
    useWindowStore.getState().openWindow({ id: "terminal", type: "terminal" });
    render(<TerminalWindow />);
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir curriculum_vitae.html" }));
    expect(useWindowStore.getState().windows.cv?.isOpen).toBe(true);
  });

  it("ouvre une ProjectWindow avec slug au click sur une ligne projet", () => {
    useWindowStore.getState().openWindow({ id: "terminal", type: "terminal" });
    render(<TerminalWindow />);
    const edf = PROJECTS.find((p) => p.slug === "edf");
    if (!edf) throw new Error("edf project missing from config");
    fireEvent.click(screen.getByRole("button", { name: `Ouvrir ${edf.terminalLine}` }));
    const state = useWindowStore.getState();
    const projectWindow = state.windows[projectWindowId("edf")];
    expect(projectWindow).toBeDefined();
    expect(projectWindow?.type).toBe("project");
    expect(projectWindow?.meta).toEqual({ slug: "edf" });
  });

  it("ouvre LinkedIn dans un nouvel onglet", () => {
    useWindowStore.getState().openWindow({ id: "terminal", type: "terminal" });
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<TerminalWindow />);
    fireEvent.click(screen.getByRole("button", { name: /linkedin\.url/ }));
    expect(openSpy).toHaveBeenCalledWith(EXTERNAL_LINKS.linkedin, "_blank", "noopener,noreferrer");
    openSpy.mockRestore();
  });

  it("met à jour le titre window à 'CommandShell 1 — <cmd>' après une commande", () => {
    useWindowStore.getState().openWindow({ id: "terminal", type: "terminal", title: "terminal" });
    render(<TerminalWindow />);
    const input = screen.getByLabelText("terminal command");
    fireEvent.change(input, { target: { value: "ls" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(useWindowStore.getState().windows.terminal.title).toBe("CommandShell 1 — ls");
  });

  it("ne met PAS à jour le titre quand la commande est vide", () => {
    useWindowStore.getState().openWindow({ id: "terminal", type: "terminal", title: "initial" });
    render(<TerminalWindow />);
    const input = screen.getByLabelText("terminal command");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(useWindowStore.getState().windows.terminal.title).toBe("initial");
  });
});
