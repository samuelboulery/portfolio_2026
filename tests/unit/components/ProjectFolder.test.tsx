import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ProjectFolder } from "@/components/folder/ProjectFolder";
import { PROJECTS, projectWindowId } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

const edf = PROJECTS.find((p) => p.slug === "edf");
if (!edf) throw new Error("edf project missing from config");

describe("ProjectFolder", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("rend le label et déclenche openWindow au click", () => {
    render(<ProjectFolder project={edf} />);
    const button = screen.getByRole("button", { name: `Ouvrir le projet ${edf.name}` });
    expect(button).toHaveTextContent(edf.folderLabel);
    fireEvent.click(button);
    const opened = useWindowStore.getState().windows[projectWindowId(edf.slug)];
    expect(opened).toBeDefined();
    expect(opened?.type).toBe("project");
    expect(opened?.isOpen).toBe(true);
    expect(opened?.meta).toEqual({ slug: edf.slug });
  });

  it("marque le dossier actif quand la fenêtre est ouverte", () => {
    useWindowStore.getState().openWindow({
      id: projectWindowId(edf.slug),
      type: "project",
      meta: { slug: edf.slug },
    });
    render(<ProjectFolder project={edf} />);
    const button = screen.getByRole("button", { name: `Ouvrir le projet ${edf.name}` });
    expect(button).toHaveAttribute("data-active", "true");
  });

  it("n'est pas actif quand la fenêtre est minimisée", () => {
    const id = projectWindowId(edf.slug);
    useWindowStore.getState().openWindow({ id, type: "project", meta: { slug: edf.slug } });
    useWindowStore.getState().minimizeWindow(id);
    render(<ProjectFolder project={edf} />);
    const button = screen.getByRole("button", { name: `Ouvrir le projet ${edf.name}` });
    expect(button).toHaveAttribute("data-active", "false");
  });
});
