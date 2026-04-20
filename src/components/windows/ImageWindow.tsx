"use client";

import { useEffect, useState } from "react";
import { Window } from "@/components/window/Window";
import styles from "./ImageWindow.module.css";

interface ImageWindowProps {
  id?: string;
  src?: string;
}

const FALLBACK_ASCII = `           ____________________
         /                      \\
        /   _____        _____   \\
       |   /     \\      /     \\   |
       |   |  o  |      |  o  |   |
       |   \\_____/      \\_____/   |
       |                          |
       |         \\_______/        |
        \\                        /
         \\______________________/`;

export function ImageWindow({ id = "image", src = "/ascii-art.txt" }: ImageWindowProps) {
  const [art, setArt] = useState<string>(FALLBACK_ASCII);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => (res.ok ? res.text() : FALLBACK_ASCII))
      .then((text) => {
        if (!cancelled) setArt(text);
      })
      .catch(() => {
        if (!cancelled) setArt(FALLBACK_ASCII);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <Window id={id} title="image.ascii">
      <pre className={styles.ascii} role="img" aria-label="Portrait ASCII de Samuel Boulery">
        {art}
      </pre>
    </Window>
  );
}
