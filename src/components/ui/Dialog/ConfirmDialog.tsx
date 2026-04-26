"use client";

import type { ReactNode } from "react";
import { Dialog } from "./Dialog";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      message={message}
      buttons={[
        { label: cancelLabel, onClick: onCancel },
        {
          label: confirmLabel,
          onClick: onConfirm,
          isDefault: true,
          variant: destructive ? "destructive" : "neutral",
        },
      ]}
    />
  );
}
