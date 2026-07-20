"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createGame,
  dropPiece,
  getDisplayBoard,
  hardDropPiece,
  moveHorizontally,
  rotateCurrentPiece,
  togglePause,
} from "./stack-builder-engine";

const HIGH_SCORE_KEY = "stack-builder-high-score";

export function useStackBuilderGame() {
  const [game, setGame] = useState(() => createGame());
  const [highScore, setHighScore] = useState(0);

  const start = useCallback(() => setGame(createGame("playing")), []);
  const moveLeft = useCallback(() => setGame((current) => moveHorizontally(current, -1)), []);
  const moveRight = useCallback(() => setGame((current) => moveHorizontally(current, 1)), []);
  const rotate = useCallback(() => setGame(rotateCurrentPiece), []);
  const softDrop = useCallback(() => setGame((current) => dropPiece(current, true)), []);
  const hardDrop = useCallback(() => setGame(hardDropPiece), []);
  const pause = useCallback(() => setGame(togglePause), []);

  useEffect(() => {
    const savedScore = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10);
    if (Number.isFinite(savedScore)) setHighScore(savedScore);
  }, []);

  useEffect(() => {
    if (game.score <= highScore) return;
    setHighScore(game.score);
    localStorage.setItem(HIGH_SCORE_KEY, String(game.score));
  }, [game.score, highScore]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const speed = Math.max(140, 720 - (game.level - 1) * 60);
    const timer = window.setInterval(() => setGame((current) => dropPiece(current)), speed);
    return () => window.clearInterval(timer);
  }, [game.level, game.status]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (game.status === "ready" && (key === "enter" || key === " ")) {
        event.preventDefault();
        start();
        return;
      }

      if (game.status === "gameover" && (key === "enter" || key === "r")) {
        event.preventDefault();
        start();
        return;
      }

      if (key === "p") {
        event.preventDefault();
        pause();
        return;
      }

      if (game.status !== "playing") return;

      const actions: Record<string, () => void> = {
        arrowdown: softDrop,
        arrowleft: moveLeft,
        arrowright: moveRight,
        arrowup: rotate,
        " ": hardDrop,
      };
      const action = actions[key];
      if (!action) return;
      event.preventDefault();
      action();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.status, hardDrop, moveLeft, moveRight, pause, rotate, softDrop, start]);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) {
        setGame((current) => current.status === "playing" ? togglePause(current) : current);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return {
    game,
    highScore,
    board: useMemo(() => getDisplayBoard(game), [game]),
    actions: { hardDrop, moveLeft, moveRight, pause, rotate, softDrop, start },
  };
}
