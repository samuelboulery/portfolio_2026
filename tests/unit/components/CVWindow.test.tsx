import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CVWindow } from "@/components/windows/CVWindow";
import { CV_DOWNLOAD_HREF, CV_SECTIONS } from "@/content/cv";
import { useWindowStore } from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("CVWindow", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("rend le titre et le sous-titre quand la fenêtre est ouverte", () => {
    useWindowStore.getState().openWindow({ id: "cv", type: "cv" });
    render(<CVWindow />);
    expect(screen.getByRole("heading", { name: "Curriculum vitae" })).toBeInTheDocument();
    expect(screen.getByText(/Samuel Boulery/)).toBeInTheDocument();
  });

  it("rend les sections et les entrées du CV", () => {
    useWindowStore.getState().openWindow({ id: "cv", type: "cv" });
    render(<CVWindow />);
    for (const section of CV_SECTIONS) {
      expect(screen.getByRole("heading", { name: section.title })).toBeInTheDocument();
      for (const item of section.items) {
        expect(screen.getAllByText(item.title).length).toBeGreaterThan(0);
      }
    }
  });

  it("ouvre le PDF dans un nouvel onglet au click sur Télécharger", () => {
    useWindowStore.getState().openWindow({ id: "cv", type: "cv" });
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<CVWindow />);
    fireEvent.click(screen.getByRole("button", { name: "Télécharger le CV en PDF" }));
    expect(openSpy).toHaveBeenCalledWith(CV_DOWNLOAD_HREF, "_blank", "noopener,noreferrer");
    openSpy.mockRestore();
  });

  it("ne rend rien quand la fenêtre est fermée", () => {
    render(<CVWindow />);
    expect(screen.queryByRole("heading", { name: "Curriculum vitae" })).not.toBeInTheDocument();
  });
});
