import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppleMenu } from "@/components/os/OSBar/AppleMenu";

const mockOpenWindow = vi.fn();
vi.mock("@/stores/windowStore", () => ({
  useWindowStore: (selector: (s: { openWindow: ReturnType<typeof vi.fn> }) => unknown) =>
    selector({ openWindow: mockOpenWindow }),
}));

describe("AppleMenu", () => {
  afterEach(() => {
    mockOpenWindow.mockClear();
  });

  it("n'affiche pas le dropdown par défaut", () => {
    const { queryByRole } = render(<AppleMenu onAbout={vi.fn()} />);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ouvre le dropdown au clic sur le bouton Apple", () => {
    const { getByRole, queryByRole } = render(<AppleMenu onAbout={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: "Menu Apple" }));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("appelle onAbout sur 'About this Macintosh' et ferme le menu", () => {
    const onAbout = vi.fn();
    const { getByRole } = render(<AppleMenu onAbout={onAbout} />);
    fireEvent.click(getByRole("button", { name: "Menu Apple" }));
    fireEvent.click(getByRole("menuitem", { name: /About this Macintosh/i }));
    expect(onAbout).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("CommandShell ouvre la fenêtre terminal via openWindow", () => {
    const { getByRole } = render(<AppleMenu onAbout={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: "Menu Apple" }));
    fireEvent.click(getByRole("menuitem", { name: "CommandShell" }));
    expect(mockOpenWindow).toHaveBeenCalledWith(
      expect.objectContaining({ id: "terminal", type: "terminal" }),
    );
  });

  it("expose les apps factices (Calculator, Note Pad…) en disabled", () => {
    const { getByRole } = render(<AppleMenu onAbout={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: "Menu Apple" }));
    expect(getByRole("menuitem", { name: "Calculator" })).toBeDisabled();
    expect(getByRole("menuitem", { name: "Note Pad" })).toBeDisabled();
    expect(getByRole("menuitem", { name: "Puzzle" })).toBeDisabled();
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByRole } = render(<AppleMenu onAbout={vi.fn()} />);
    fireEvent.click(getByRole("button", { name: "Menu Apple" }));
    expect(document.querySelector("[role='menu']")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("active data-active sur le trigger quand le menu est ouvert", () => {
    const { getByRole } = render(<AppleMenu onAbout={vi.fn()} />);
    const trigger = getByRole("button", { name: "Menu Apple" });
    expect(trigger.hasAttribute("data-active")).toBe(false);
    fireEvent.click(trigger);
    expect(trigger.getAttribute("data-active")).toBe("true");
  });
});
