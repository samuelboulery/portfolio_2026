import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "@/components/ui/Dialog/Dialog";

describe("Dialog", () => {
  it("ne rend rien quand open est false", () => {
    const { container } = render(
      <Dialog
        open={false}
        onClose={vi.fn()}
        message="Hidden"
        buttons={[{ label: "OK", onClick: vi.fn() }]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("rend un alertdialog avec le message et les boutons quand open est true", () => {
    render(
      <Dialog
        open
        onClose={vi.fn()}
        title="Confirm"
        message="Are you sure?"
        buttons={[
          { label: "Cancel", onClick: vi.fn() },
          { label: "OK", onClick: vi.fn(), isDefault: true },
        ]}
      />,
    );
    expect(screen.getByRole("alertdialog", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("Escape appelle onClose", () => {
    const onClose = vi.fn();
    render(
      <Dialog
        open
        onClose={onClose}
        message="x"
        buttons={[{ label: "OK", onClick: vi.fn(), isDefault: true }]}
      />,
    );
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Enter active le bouton par défaut", () => {
    const onDefault = vi.fn();
    render(
      <Dialog
        open
        onClose={vi.fn()}
        message="x"
        buttons={[
          { label: "Cancel", onClick: vi.fn() },
          { label: "OK", onClick: onDefault, isDefault: true },
        ]}
      />,
    );
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Enter" });
    expect(onDefault).toHaveBeenCalledTimes(1);
  });

  it("clic dans le backdrop ne ferme PAS le dialog (System 6 : seuls les boutons et Escape ferment)", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose} message="x" buttons={[{ label: "OK", onClick: vi.fn() }]} />,
    );
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("le bouton par défaut a data-default='true'", () => {
    render(
      <Dialog
        open
        onClose={vi.fn()}
        message="x"
        buttons={[
          { label: "Cancel", onClick: vi.fn() },
          { label: "OK", onClick: vi.fn(), isDefault: true },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "OK" }).getAttribute("data-default")).toBe("true");
    expect(screen.getByRole("button", { name: "Cancel" }).hasAttribute("data-default")).toBe(false);
  });
});
