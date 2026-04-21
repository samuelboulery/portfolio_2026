"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import styles from "./ShutdownScreen.module.css";

interface ShutdownScreenProps {
  onRestart: () => void;
}

export function ShutdownScreen({ onRestart }: ShutdownScreenProps) {
  useEffect(() => {
    document.addEventListener("keydown", onRestart);
    return () => document.removeEventListener("keydown", onRestart);
  }, [onRestart]);

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      data-testid="shutdown-screen"
      onClick={onRestart}
    >
      <div className={styles.terminal}>
        <p className={styles.line}>[ shutting down... ]</p>
        <p className={styles.line}>Système arrêté.</p>
        <p className={styles.hint}>Pour relancer : cliquez n'importe où.</p>
      </div>
    </motion.div>
  );
}
