"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  activateCodeRefactor,
  createBugHunterGame,
  fireBugHunterWeapon,
  selectBugHunterWeapon,
  startBugHunterGame,
  toggleBugHunterPause,
  consumeBugHunterItem,
} from "./bug-hunter-actions";
import { advanceBugHunterGame } from "./bug-hunter-engine";
import type {
  BugHunterInput,
  BugHunterState,
  BugHunterWeapon,
  Point,
} from "./bug-hunter.types";

const SAVE_KEY = "bug-hunter-save-v1";
const HIGH_SCORE_KEY = "bug-hunter-high-score";
const EMPTY_INPUT: BugHunterInput = {
  down: false,
  left: false,
  repair: false,
  right: false,
  up: false,
};

function readHighScore() {
  if (typeof window === "undefined") return 0;
  const value = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10);
  return Number.isFinite(value) ? value : 0;
}

function readSavedGame() {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null") as BugHunterState | null;
    if (!parsed || typeof parsed.score !== "number" || !parsed.player) return null;
    return {
      ...parsed,
      phase: "paused" as const,
      projectiles: [],
      refactorCharge: parsed.refactorCharge ?? 0,
    };
  } catch {
    return null;
  }
}

export function useBugHunter() {
  const [game, setGame] = useState(() => createBugHunterGame());
  const [hasSave, setHasSave] = useState(false);
  const inputRef = useRef<BugHunterInput>({ ...EMPTY_INPUT });
  const gameRef = useRef(game);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    const highScore = readHighScore();
    const saved = readSavedGame();
    setHasSave(Boolean(saved));
    setGame((current) => ({ ...current, highScore }));
  }, []);

  useEffect(() => {
    if (game.phase !== "playing") return;
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
        setGame((current) => advanceBugHunterGame(current, step, inputRef.current));
      }
      frame = window.requestAnimationFrame(animate);
    }

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [game.phase]);

  useEffect(() => {
    if (game.highScore <= readHighScore()) return;
    localStorage.setItem(HIGH_SCORE_KEY, String(game.highScore));
  }, [game.highScore]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = gameRef.current;
      if (current.phase !== "playing" && current.phase !== "paused") return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(current));
      setHasSave(true);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  const newGame = useCallback((levelIndex = 0) => {
    inputRef.current = { ...EMPTY_INPUT };
    setGame(createBugHunterGame(levelIndex, "playing", readHighScore()));
  }, []);

  const continueGame = useCallback(() => {
    const saved = readSavedGame();
    if (!saved) {
      newGame(0);
      return;
    }
    setGame({ ...saved, phase: "playing", highScore: readHighScore() });
  }, [newGame]);

  const restart = useCallback(() => {
    setGame((current) =>
      createBugHunterGame(current.levelIndex, "playing", current.highScore),
    );
  }, []);

  const pause = useCallback(() => setGame(toggleBugHunterPause), []);
  const selectWeapon = useCallback(
    (weapon: BugHunterWeapon) =>
      setGame((current) => selectBugHunterWeapon(current, weapon)),
    [],
  );
  const activateRefactor = useCallback(
    () => setGame(activateCodeRefactor),
    [],
  );
  const consumeItem = useCallback(
    (item: "coffee" | "energy-cell" | "repair-kit") =>
      setGame((current) => consumeBugHunterItem(current, item)),
    [],
  );
  const fireAt = useCallback(
    (target: Point) => setGame((current) => fireBugHunterWeapon(current, target)),
    [],
  );
  const fireNearest = useCallback(() => {
    setGame((current) => {
      const nearest = [...current.enemies].sort(
        (a, b) =>
          Math.hypot(a.x - current.player.x, a.y - current.player.y) -
          Math.hypot(b.x - current.player.x, b.y - current.player.y),
      )[0];
      const target = nearest ?? { x: current.player.x + 12, y: current.player.y };
      return fireBugHunterWeapon(current, target);
    });
  }, []);

  const setInput = useCallback((key: keyof BugHunterInput, active: boolean) => {
    inputRef.current = { ...inputRef.current, [key]: active };
  }, []);

  useEffect(() => {
    const movementKeys: Record<string, keyof BugHunterInput> = {
      arrowdown: "down",
      arrowleft: "left",
      arrowright: "right",
      arrowup: "up",
      a: "left",
      d: "right",
      e: "repair",
      s: "down",
      w: "up",
    };
    const weapons: Record<string, BugHunterWeapon> = {
      "1": "debugger",
      "2": "unit-test",
      "3": "hotfix",
      "4": "patch",
    };

    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const movement = movementKeys[key];
      if (movement) {
        event.preventDefault();
        setInput(movement, true);
        return;
      }
      if (weapons[key]) {
        event.preventDefault();
        selectWeapon(weapons[key]);
        return;
      }
      if (key === " ") {
        event.preventDefault();
        fireNearest();
      }
      if (key === "q") {
        event.preventDefault();
        activateRefactor();
      }
      if (key === "p") {
        event.preventDefault();
        pause();
      }
      if (key === "c") {
        event.preventDefault();
        consumeItem("coffee");
      }
      if (key === "r") {
        event.preventDefault();
        consumeItem("repair-kit");
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      const movement = movementKeys[event.key.toLowerCase()];
      if (movement) setInput(movement, false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [activateRefactor, consumeItem, fireNearest, pause, selectWeapon, setInput]);

  useEffect(() => {
    function onVisibilityChange() {
      if (!document.hidden) return;
      setGame((current) =>
        current.phase === "playing" ? toggleBugHunterPause(current) : current,
      );
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return {
    actions: {
      continueGame,
      activateRefactor,
      fireAt,
      fireNearest,
      newGame,
      pause,
      restart,
      selectWeapon,
      setInput,
      start: () => setGame(startBugHunterGame),
      useItem: consumeItem,
    },
    game,
    hasSave,
  };
}
