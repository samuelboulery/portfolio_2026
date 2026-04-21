"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import styles from "./BootScreen.module.css";

interface BootLine {
  text: string;
  type: "header" | "ok" | "cursor";
}

const BOOT_LINES: BootLine[] = [
  { text: "Portfolio OS 2026 — Samuel Boulery", type: "header" },
  { text: "Booting imagination", type: "ok" },
  { text: "Loading 6 years of experience", type: "ok" },
  { text: "Injecting obsession with details", type: "ok" },
  { text: "Connecting EDF / CBTW instances", type: "ok" },
  { text: "Warming up coffee", type: "ok" },
  { text: "Ready", type: "cursor" },
];

const BOOT_DONE_KEY = "boot-done";
const LINE_DELAY_MS = 400;
const POST_SEQUENCE_DELAY_MS = 600;
const TOTAL_DELAY_MS = BOOT_LINES.length * LINE_DELAY_MS + POST_SEQUENCE_DELAY_MS;

interface BootScreenProps {
  onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const doneRef = useRef(false);

  const skip = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    sessionStorage.setItem(BOOT_DONE_KEY, "1");
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (sessionStorage.getItem(BOOT_DONE_KEY) || prefersReducedMotion) {
      skip();
      return;
    }

    const timer = setTimeout(skip, TOTAL_DELAY_MS);
    document.addEventListener("keydown", skip);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", skip);
    };
  }, [skip, prefersReducedMotion]);

  return (
    <motion.div
      className={styles.root}
      initial={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
      style={{ transformOrigin: "center" }}
      aria-hidden="true"
      data-testid="boot-screen"
      onClick={skip}
    >
      <div className={styles.terminal}>
        {BOOT_LINES.map((line, index) => (
          <div
            key={line.text}
            className={styles.line}
            style={{ animationDelay: `${index * LINE_DELAY_MS}ms` }}
          >
            {line.type === "header" ? (
              <span className={styles.header}>{line.text}</span>
            ) : (
              <span className={styles.row}>
                <span className={styles.label}>{line.text.padEnd(35, ".")}</span>
                {line.type === "cursor" ? (
                  <span className={styles.cursor}>▌</span>
                ) : (
                  <span className={styles.ok}> OK</span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
