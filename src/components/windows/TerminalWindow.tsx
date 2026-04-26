"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LisaScrollbar } from "@/components/ui/LisaScrollbar";
import { Window } from "@/components/window/Window";
import { projectWindowId } from "@/content/projects.config";
import {
  type AnimationSpec,
  completeInput,
  INITIAL_TERMINAL_CWD,
  type OutputLine,
  parseCommand,
  runCommand,
  TERMINAL_TARGETS,
  type TerminalEffect,
  type TerminalTarget,
} from "@/lib/terminal/commands";
import { MATRIX_CHARS } from "@/lib/terminal/easterEggs";
import { pathToLabel } from "@/lib/terminal/fs";
import { selectIsFocused, useWindowStore } from "@/stores/windowStore";
import styles from "./TerminalWindow.module.css";

interface TerminalWindowProps {
  id?: string;
}

interface OutputEntry {
  readonly id: number;
  readonly line: OutputLine;
}

function openExternal(url: string) {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function TerminalWindow({ id = "terminal" }: TerminalWindowProps) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setTitle = useWindowStore((state) => state.setTitle);
  const isFocused = useWindowStore(selectIsFocused(id));

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);
  const mountedAtRef = useRef<number>(Date.now());

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<readonly string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [entries, setEntries] = useState<readonly OutputEntry[]>([]);
  const [cwd, setCwd] = useState<readonly string[]>(INITIAL_TERMINAL_CWD);
  const [tabCycle, setTabCycle] = useState<{
    readonly candidates: readonly string[];
    readonly index: number;
  } | null>(null);
  const [animation, setAnimation] = useState<AnimationSpec | null>(null);

  const cwdLabel = pathToLabel(cwd);

  const appendLines = useCallback((lines: readonly OutputLine[]) => {
    if (lines.length === 0) return;
    setEntries((prev) => {
      const mapped: OutputEntry[] = lines.map((line) => {
        const id = nextIdRef.current++;
        return { id, line };
      });
      return [...prev, ...mapped];
    });
  }, []);

  const applyEffect = useCallback(
    (effect: TerminalEffect) => {
      switch (effect.kind) {
        case "openProject":
          openWindow({
            id: projectWindowId(effect.slug),
            type: "project",
            title: effect.title,
            meta: { slug: effect.slug },
          });
          return;
        case "openCv":
          openWindow({ id: "cv", type: "cv", title: "curriculum_vitae" });
          return;
        case "openUrl":
          openExternal(effect.url);
          return;
        case "clear":
          setEntries([]);
          return;
        case "closeTerminal":
          window.setTimeout(() => closeWindow(id), 300);
          return;
        case "animation":
          setAnimation(effect.spec);
          return;
      }
    },
    [closeWindow, id, openWindow],
  );

  const activateTarget = useCallback(
    (target: TerminalTarget) => {
      applyEffect(target.effect);
    },
    [applyEffect],
  );

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const echo: OutputLine = { kind: "command", text: `→ ${cwdLabel} ${raw}` };

      if (!trimmed) {
        appendLines([echo]);
        return;
      }

      setTitle(id, `CommandShell 1 — ${trimmed}`);

      const parsed = parseCommand(trimmed);
      const result = runCommand(parsed, cwd, { mountedAt: mountedAtRef.current });

      if (result.effect?.kind === "clear") {
        setEntries([]);
      } else {
        appendLines([echo, ...result.output]);
      }

      if (result.cwdChange !== undefined) {
        setCwd(result.cwdChange);
      }

      if (result.effect && result.effect.kind !== "clear") {
        applyEffect(result.effect);
      }

      setHistory((prev) => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]));
      setHistoryCursor(null);
    },
    [appendLines, applyEffect, cwd, cwdLabel, id, setTitle],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        executeCommand(input);
        setInput("");
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (history.length === 0) return;
        const next = historyCursor === null ? history.length - 1 : Math.max(0, historyCursor - 1);
        setHistoryCursor(next);
        setInput(history[next] ?? "");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyCursor === null) return;
        const next = historyCursor + 1;
        if (next >= history.length) {
          setHistoryCursor(null);
          setInput("");
        } else {
          setHistoryCursor(next);
          setInput(history[next] ?? "");
        }
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const reverse = event.shiftKey;

        if (tabCycle && tabCycle.candidates.length > 1) {
          const len = tabCycle.candidates.length;
          const nextIndex = reverse ? (tabCycle.index - 1 + len) % len : (tabCycle.index + 1) % len;
          setInput(tabCycle.candidates[nextIndex]);
          setTabCycle({ candidates: tabCycle.candidates, index: nextIndex });
          return;
        }

        const candidates = completeInput(input, cwd);
        if (candidates.length === 0) return;
        if (candidates.length === 1) {
          setInput(candidates[0]);
          setTabCycle(null);
          return;
        }

        appendLines([
          { kind: "command", text: `→ ${cwdLabel} ${input}` },
          { kind: "result", text: candidates.join("  ") },
        ]);
        setInput(candidates[0]);
        setTabCycle({ candidates, index: 0 });
        return;
      }
    },
    [appendLines, cwd, cwdLabel, executeCommand, history, historyCursor, input, tabCycle],
  );

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("button") || target.closest("input")) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    container.addEventListener("mousedown", handleMouseDown);
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, []);

  useEffect(() => {
    if (entries.length === 0) return;
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries.length]);

  useEffect(() => {
    if (!animation) return;

    const timers: number[] = [];
    let stopped = false;

    const stop = () => {
      if (stopped) return;
      stopped = true;
      for (const t of timers) window.clearTimeout(t);
      setAnimation(null);
    };

    const handleKeydown = () => stop();
    document.addEventListener("keydown", handleKeydown);

    if (animation.variant === "matrix") {
      const { durationMs } = animation;
      const startedAt = Date.now();
      const tick = () => {
        if (stopped) return;
        if (Date.now() - startedAt >= durationMs) {
          stop();
          return;
        }
        const width = 32;
        let line = "";
        for (let i = 0; i < width; i += 1) {
          line += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        }
        appendLines([{ kind: "result", text: line }]);
        timers.push(window.setTimeout(tick, 50));
      };
      timers.push(window.setTimeout(tick, 0));
    } else if (animation.variant === "hack" || animation.variant === "scroll") {
      const { lines, lineIntervalMs } = animation;
      lines.forEach((text, i) => {
        timers.push(
          window.setTimeout(() => {
            if (stopped) return;
            appendLines([{ kind: "result", text }]);
            if (i === lines.length - 1) stop();
          }, i * lineIntervalMs),
        );
      });
    } else if (animation.variant === "staged") {
      const { stages } = animation;
      let accumulated = 0;
      stages.forEach((stage, i) => {
        accumulated += stage.delayMs;
        timers.push(
          window.setTimeout(() => {
            if (stopped) return;
            appendLines([{ kind: "result", text: stage.text }]);
            if (i === stages.length - 1) stop();
          }, accumulated),
        );
      });
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      for (const t of timers) window.clearTimeout(t);
    };
  }, [animation, appendLines]);

  const targets = useMemo(() => TERMINAL_TARGETS, []);

  return (
    <Window id={id} title="terminal" showContentPadding={false}>
      <LisaScrollbar orientation="vertical">
        <div ref={containerRef} className={styles.terminal}>
          <p className={styles.prompt}>
            <span className={styles.promptSymbol}>→</span>
            <span className={styles.path}>{pathToLabel(INITIAL_TERMINAL_CWD)}</span>
            <span className={styles.command}>ls</span>
          </p>
          <ul className={styles.list}>
            {targets.map((target) => (
              <li key={target.slug}>
                <button
                  type="button"
                  className={target.kind === "doc" ? styles.linkDoc : styles.linkProject}
                  onClick={() => activateTarget(target)}
                  aria-label={
                    target.kind === "external"
                      ? `Ouvrir ${target.label} dans un nouvel onglet`
                      : `Ouvrir ${target.label}`
                  }
                >
                  {target.label}
                </button>
              </li>
            ))}
          </ul>
          {entries.map((entry) => (
            <p
              key={entry.id}
              className={
                entry.line.kind === "error"
                  ? styles.outputError
                  : entry.line.kind === "command"
                    ? styles.outputCommand
                    : styles.outputResult
              }
            >
              {entry.line.text}
            </p>
          ))}
          <p className={styles.prompt} data-focused={isFocused}>
            <span className={styles.promptSymbol}>→</span>
            <span className={styles.path}>{cwdLabel}</span>
            <span className={styles.inputGroup}>
              <span className={styles.inputDisplay}>{input}</span>
              <span className={styles.cursor} aria-hidden="true" />
            </span>
            <input
              ref={inputRef}
              type="text"
              className={styles.inputHidden}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTabCycle(null);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="terminal command"
            />
          </p>
          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </LisaScrollbar>
    </Window>
  );
}
