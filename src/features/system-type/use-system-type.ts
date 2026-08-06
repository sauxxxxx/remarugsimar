"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  activateSystemRefactor,
  advanceSystemType,
  createSystemTypeState,
  startSystemType,
  toggleSystemTypePause,
  typeSystemKey,
} from "./system-type-engine";
import { useSystemTypeAudio } from "./use-system-type-audio";

const HIGH_SCORE_KEY = "system-type-high-score";

function readHighScore() {
  if (typeof window === "undefined") return 0;
  const parsed = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useSystemType() {
  const [state, setState] = useState(() => createSystemTypeState());
  const stateRef = useRef(state);
  const lastImpactRef = useRef(0);
  const lastPhaseRef = useRef(state.phase);
  const { muted, play, toggleMuted } = useSystemTypeAudio();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setState((current) => ({ ...current, highScore: readHighScore() }));
  }, []);

  useEffect(() => {
    if (state.phase !== "running" && state.phase !== "scanning") return;
    let frame = 0;
    let previous = performance.now();
    let accumulated = 0;

    function animate(now: number) {
      const delta = Math.min(now - previous, 80);
      previous = now;
      accumulated += delta;
      if (accumulated >= 32) {
        const step = accumulated;
        accumulated = 0;
        setState((current) => advanceSystemType(current, step));
      }
      frame = window.requestAnimationFrame(animate);
    }

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [state.phase]);

  useEffect(() => {
    if (state.highScore <= readHighScore()) return;
    localStorage.setItem(HIGH_SCORE_KEY, String(state.highScore));
  }, [state.highScore]);

  useEffect(() => {
    if (state.impacts > lastImpactRef.current) play("impact");
    lastImpactRef.current = state.impacts;
  }, [play, state.impacts]);

  useEffect(() => {
    if (state.phase === "victory" && lastPhaseRef.current !== "victory") play("victory");
    lastPhaseRef.current = state.phase;
  }, [play, state.phase]);

  const start = useCallback(() => {
    play("scan");
    setState(startSystemType);
  }, [play]);
  const pause = useCallback(() => setState(toggleSystemTypePause), []);
  const restart = useCallback(() => {
    setState(createSystemTypeState(readHighScore()));
    play("scan");
    window.requestAnimationFrame(() => setState(startSystemType));
  }, [play]);
  const refactor = useCallback(() => {
    play("refactor");
    setState(activateSystemRefactor);
  }, [play]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key.toLowerCase();
      const current = stateRef.current;
      const phase = current.phase;
      const target = current.threats.find((threat) => threat.id === current.targetId);
      const expectedKey = target?.word[target.typed];

      if (key === "escape") return;
      if (phase === "running" && /^[a-z]$/.test(key) && expectedKey === key) {
        event.preventDefault();
        setState((value) => {
          const active = value.threats.find((threat) => threat.id === value.targetId);
          const next = typeSystemKey(value, key);
          play(next.eliminated > value.eliminated ? "kill" : "key", active?.kind);
          return next;
        });
        return;
      }
      if (key === "p") {
        event.preventDefault();
        pause();
        return;
      }
      if (key === "tab") {
        event.preventDefault();
        restart();
        return;
      }
      if ((key === "enter" || key === " ") && phase === "idle") {
        event.preventDefault();
        start();
        return;
      }
      if ((key === "enter" || key === " ") && phase === "gameover") {
        event.preventDefault();
        restart();
        return;
      }
      if (key === "q" && current.refactorCharge >= 100) {
        event.preventDefault();
        refactor();
        return;
      }
      if (/^[a-z]$/.test(key)) {
        event.preventDefault();
        setState((current) => {
          const currentTarget = current.threats.find((threat) => threat.id === current.targetId)
            ?? [...current.threats].filter((threat) => threat.word[0] === key).sort((a, b) => a.x - b.x)[0];
          const next = typeSystemKey(current, key);
          if (next.correctKeys > current.correctKeys) {
            play(next.eliminated > current.eliminated ? "kill" : "key", currentTarget?.kind);
          } else if (next.mistakes > current.mistakes) {
            play("mistake");
          }
          return next;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pause, play, refactor, restart, start]);

  useEffect(() => {
    function handleVisibility() {
      if (!document.hidden) return;
      setState((current) => current.phase === "running" ? toggleSystemTypePause(current) : current);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return {
    actions: { pause, refactor, restart, start, toggleMuted },
    muted,
    state,
  };
}
