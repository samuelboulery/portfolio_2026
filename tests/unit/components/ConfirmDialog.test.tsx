import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "@/components/ui/Dialog/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("rend les libellés Confirm/Cancel", () => {
    render(
      <ConfirmDialog
        open
        message="Are you sure ?"
        confirmLabel="Shut Down"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Shut Down" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("Confirm appelle onConfirm", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog open message="x" confirmLabel="OK" onConfirm={onConfirm} onCancel={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("Cancel appelle onCancel", () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog open message="x" confirmLabel="OK" onConfirm={vi.fn()} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("Confirm est marqué bouton par défaut", () => {
    render(
      <ConfirmDialog open message="x" confirmLabel="OK" onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "OK" }).getAttribute("data-default")).toBe("true");
  });

  it("destructive ajoute data-variant='destructive'", () => {
    render(
      <ConfirmDialog
        open
        message="x"
        confirmLabel="Delete"
        destructive
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Delete" }).getAttribute("data-variant")).toBe(
      "destructive",
    );
  });

  it("libellé Cancel surcharge via cancelLabel", () => {
    render(
      <ConfirmDialog
        open
        message="x"
        confirmLabel="Save"
        cancelLabel="Don't Save"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Don't Save" })).toBeInTheDocument();
  });
});
