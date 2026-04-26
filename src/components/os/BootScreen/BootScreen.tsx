"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { HappyMac } from "@/components/os/icons/HappyMac";
import styles from "./BootScreen.module.css";

const BOOT_DONE_KEY = "boot-done";
const BOOT_DURATION_MS = 1800;

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

    const timer = setTimeout(skip, BOOT_DURATION_MS);
    document.addEventListener("keydown", skip);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", skip);
    };
  }, [skip, prefersReducedMotion]);

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
      data-testid="boot-screen"
      onClick={skip}
    >
      <div className={styles.frame}>
        <motion.div
          className={styles.icon}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" },
          }}
        >
          <HappyMac size={72} />
        </motion.div>
        <motion.p
          className={styles.welcome}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.4, duration: 0.4, ease: "easeOut" },
          }}
        >
          Welcome to Macintosh
        </motion.p>
      </div>
    </motion.div>
  );
}
