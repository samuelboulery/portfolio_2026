"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { FinderIcon } from "@/components/ui/icons/FinderIcon";
import styles from "./Dialog.module.css";

export interface DialogButton {
  label: string;
  onClick: () => void;
  isDefault?: boolean;
  variant?: "neutral" | "destructive";
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title?: string;
  message: ReactNode;
  buttons: ReadonlyArray<DialogButton>;
}

export function Dialog({ open, onClose, icon, title, message, buttons }: DialogProps) {
  const defaultButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    defaultButtonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "Enter") {
      const defaultButton = buttons.find((button) => button.isDefault);
      if (defaultButton) {
        event.preventDefault();
        defaultButton.onClick();
      }
    }
  }

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.body}>
          <div className={styles.iconColumn} aria-hidden="true">
            {icon ?? <FinderIcon kind="warning" size={32} />}
          </div>
          <div className={styles.messageColumn}>
            {title ? <p className={styles.title}>{title}</p> : null}
            <div className={styles.message}>{message}</div>
          </div>
        </div>
        <div className={styles.actions}>
          {buttons.map((button) => (
            <Button
              key={button.label}
              ref={button.isDefault ? defaultButtonRef : undefined}
              variant="outlined"
              defaultRing={button.isDefault}
              fixedMinWidth
              data-variant={button.variant ?? "neutral"}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
