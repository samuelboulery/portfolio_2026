import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MainWindow } from "@/components/windows/MainWindow";
import { CONTACT_EMAIL } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("MainWindow", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("rend le titre Samuel Boulery et le sous-titre", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(<MainWindow />);
    expect(screen.getByRole("heading", { name: "Samuel Boulery" })).toBeInTheDocument();
  });

  it("ouvre la fenêtre CV quand on clique sur 'En savoir plus'", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    render(<MainWindow />);
    fireEvent.click(screen.getByRole("button", { name: "En savoir plus" }));
    const cv = useWindowStore.getState().windows.cv;
    expect(cv).toBeDefined();
    expect(cv?.isOpen).toBe(true);
    expect(cv?.type).toBe("cv");
  });

  it("déclenche un mailto quand on clique sur 'Me contacter'", () => {
    useWindowStore.getState().openWindow({ id: "main", type: "main" });
    const originalLocation = window.location;
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        ...originalLocation,
        set href(value: string) {
          hrefSetter(value);
        },
      },
    });
    render(<MainWindow />);
    fireEvent.click(screen.getByRole("button", { name: /Me contacter/ }));
    expect(hrefSetter).toHaveBeenCalledWith(`mailto:${CONTACT_EMAIL}`);
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });
});
