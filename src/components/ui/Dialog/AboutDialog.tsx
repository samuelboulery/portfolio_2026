"use client";

import { FinderIcon } from "@/components/ui/icons/FinderIcon";
import { Dialog } from "./Dialog";

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      icon={<FinderIcon kind="apple" size={32} />}
      title="About this Macintosh"
      message={
        <>
          Samuel Boulery — System Designer
          <br />
          Portfolio 2026 — v1.0
          <br />© Lisa Office System rendition
        </>
      }
      buttons={[{ label: "OK", onClick: onClose, isDefault: true }]}
    />
  );
}
