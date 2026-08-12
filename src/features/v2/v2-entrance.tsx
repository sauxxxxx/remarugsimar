"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./v2-entrance.module.css";

const FINAL_WORD = "REMAR";
const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type EntrancePhase = "loading" | "scramble" | "settled" | "split" | "exiting";

function createScrambledWord(progress: number) {
  return FINAL_WORD.split("").map((letter, index) => {
    const settledAt = (index + 1) / (FINAL_WORD.length + 1);
    if (progress >= settledAt) return letter;

    const randomIndex = Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length);
    return SCRAMBLE_CHARACTERS[randomIndex];
  });
}

export function V2Entrance() {
  const [phase, setPhase] = useState<EntrancePhase>("loading");
  const [progress, setProgress] = useState(0);
  const [letters, setLetters] = useState(() => FINAL_WORD.split(""));
  const finishedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const finish = useCallback((skipped = false) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase("exiting");

    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    const main = document.querySelector<HTMLElement>("#v2-main");
    const exitDelay = skipped ? 180 : 460;

    window.setTimeout(() => {
      document.documentElement.dataset.v2Entrance = "complete";
      if (main) main.inert = false;
    }, exitDelay);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.v2Entrance !== "pending") return;

    const main = document.querySelector<HTMLElement>("#v2-main");
    if (main) main.inert = true;

    const startedAt = performance.now();
    let progressFrame = 0;
    let scrambleInterval = 0;

    const updateProgress = (now: number) => {
      const nextProgress = Math.min(100, Math.round(((now - startedAt) / 720) * 100));
      setProgress(nextProgress);
      if (nextProgress < 100) progressFrame = window.requestAnimationFrame(updateProgress);
    };

    progressFrame = window.requestAnimationFrame(updateProgress);

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timersRef.current.push(timer);
    };

    schedule(() => {
      setPhase("scramble");
      const scrambleStartedAt = performance.now();

      scrambleInterval = window.setInterval(() => {
        const scrambleProgress = Math.min(1, (performance.now() - scrambleStartedAt) / 1320);
        setLetters(createScrambledWord(scrambleProgress));
      }, 58);
    }, 560);

    schedule(() => {
      window.clearInterval(scrambleInterval);
      setLetters(FINAL_WORD.split(""));
      setPhase("settled");
    }, 2020);

    schedule(() => setPhase("split"), 2620);
    schedule(() => finish(false), 3680);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(progressFrame);
      window.clearInterval(scrambleInterval);
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
      window.removeEventListener("keydown", handleKeyDown);
      if (main) main.inert = false;
    };
  }, [finish]);

  return (
    <div
      aria-label="Portfolio introduction"
      aria-modal="true"
      className={`${styles.entrance} ${styles[phase]}`}
      role="dialog"
    >
      <div aria-hidden="true" className={styles.grid} />

      <div aria-hidden="true" className={styles.word} data-phase={phase}>
        {letters.map((letter, index) => (
          <span className={styles.letter} key={`${index}-${FINAL_WORD[index]}`}>
            <span>{letter}</span>
          </span>
        ))}
      </div>

      <p aria-live="polite" className={styles.progress}>
        <span className="sr-only">Loading portfolio: </span>
        {String(progress).padStart(2, "0")}%
      </p>

      <button className={styles.skip} onClick={() => finish(true)} type="button">
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
