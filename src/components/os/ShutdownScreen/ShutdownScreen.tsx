"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import styles from "./ShutdownScreen.module.css";

interface ShutdownScreenProps {
  onRestart: () => void;
}

export function ShutdownScreen({ onRestart }: ShutdownScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const calledRef = useRef(false);

  const handleRestart = useCallback(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    onRestart();
  }, [onRestart]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        handleRestart();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleRestart]);

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: prefersReducedMotion ? 0 : 0.4 } }}
      exit={{ opacity: 0, transition: { duration: prefersReducedMotion ? 0 : 0.3 } }}
      data-testid="shutdown-screen"
      onClick={handleRestart}
    >
      <div className={styles.terminal}>
        <p className={styles.line}>[ shutting down... ]</p>
        <p className={styles.line}>Système arrêté.</p>
        <p className={styles.hint}>Pour relancer : cliquez n'importe où.</p>
      </div>
    </motion.div>
  );
}
