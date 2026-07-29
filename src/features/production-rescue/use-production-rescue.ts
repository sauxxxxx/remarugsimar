"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  advanceRescueMotion,
  createRescueGame,
  interact,
  movePlayer,
  navigateTo,
  selectEquipment,
  targetBug,
  targetCoffeeMachine,
  targetSystem,
  tickRescueGame,
  toggleRescuePause,
} from "./production-rescue-engine";
import type {
  Direction,
  Point,
  RescueActionAnimation,
  RescueTool,
} from "./production-rescue.types";

const HIGH_SCORE_KEY = "production-rescue-high-score";

export function useProductionRescue() {
  const motionTimer = useRef<number | null>(null);
  const actionTimer = useRef<number | null>(null);
  const movementFrame = useRef<number | null>(null);
  const movementReleaseTimer = useRef<number | null>(null);
  const heldDirection = useRef<Direction | null>(null);
  const lastMovementAt = useRef(0);
  const [game, setGame] = useState(() => createRescueGame());
  const [highScore, setHighScore] = useState(0);
  const [showCollisionMap, setShowCollisionMap] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [actionAnimation, setActionAnimation] =
    useState<RescueActionAnimation | null>(null);

  const triggerActionAnimation = useCallback((
    kind: RescueActionAnimation,
    duration = 650,
  ) => {
    setActionAnimation(kind);
    if (actionTimer.current) window.clearTimeout(actionTimer.current);
    actionTimer.current = window.setTimeout(() => setActionAnimation(null), duration);
  }, []);

  const start = useCallback(() => setGame(createRescueGame("playing")), []);
  const move = useCallback((direction: Direction) => {
    setGame((current) => movePlayer(current, direction));
    setIsMoving(true);
    if (motionTimer.current) window.clearTimeout(motionTimer.current);
    motionTimer.current = window.setTimeout(() => setIsMoving(false), 150);
  }, []);
  const action = useCallback(() => {
    setGame(interact);
    triggerActionAnimation("interact");
  }, [triggerActionAnimation]);
  const pause = useCallback(() => setGame(toggleRescuePause), []);
  const select = useCallback((tool: RescueTool) => {
    setGame((current) => selectEquipment(current, tool));
  }, []);
  const chooseSystem = useCallback((systemId: string) => {
    setGame((current) => targetSystem(current, systemId));
  }, []);
  const chooseBug = useCallback((bugId: number) => {
    setGame((current) => targetBug(current, bugId));
    if (game.activeTool === "gun") triggerActionAnimation("gun", 520);
  }, [game.activeTool, triggerActionAnimation]);
  const chooseCoffee = useCallback(() => setGame(targetCoffeeMachine), []);
  const worldClick = useCallback((point: Point) => {
    setGame((current) => navigateTo(current, point));
    if (game.activeTool === "gun") triggerActionAnimation("gun", 520);
    if (game.activeTool === "coffee" || game.activeTool === "ammo") {
      triggerActionAnimation("interact");
    }
  }, [game.activeTool, triggerActionAnimation]);

  useEffect(() => {
    const storedScore = Number(localStorage.getItem(HIGH_SCORE_KEY) ?? 0);
    setHighScore(Number.isFinite(storedScore) ? storedScore : 0);
    return () => {
      if (motionTimer.current) window.clearTimeout(motionTimer.current);
      if (actionTimer.current) window.clearTimeout(actionTimer.current);
      if (movementFrame.current) window.cancelAnimationFrame(movementFrame.current);
      if (movementReleaseTimer.current) window.clearTimeout(movementReleaseTimer.current);
    };
  }, []);

  useEffect(() => {
    if (game.score <= highScore) return;
    setHighScore(game.score);
    localStorage.setItem(HIGH_SCORE_KEY, String(game.score));
  }, [game.score, highScore]);

  useEffect(() => {
    if (game.message.startsWith("Wrench strike")) {
      triggerActionAnimation("wrench");
    } else if (game.message === "Coffee acquired.") {
      triggerActionAnimation("interact");
    }
  }, [game.message, triggerActionAnimation]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const timer = window.setInterval(() => setGame(tickRescueGame), 1000);
    return () => window.clearInterval(timer);
  }, [game.status]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const timer = window.setInterval(
      () => setGame((current) => advanceRescueMotion(current, 0.1)),
      100,
    );
    return () => window.clearInterval(timer);
  }, [game.status]);

  useEffect(() => {
    function animateMovement(timestamp: number) {
      if (heldDirection.current && timestamp - lastMovementAt.current >= 78) {
        const direction = heldDirection.current;
        setGame((current) => movePlayer(current, direction));
        setIsMoving(true);
        lastMovementAt.current = timestamp;
      }
      movementFrame.current = window.requestAnimationFrame(animateMovement);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLocaleLowerCase();
      const directions: Partial<Record<string, Direction>> = {
        arrowdown: "down",
        arrowleft: "left",
        arrowright: "right",
        arrowup: "up",
        a: "left",
        d: "right",
        s: "down",
        w: "up",
      };
      const direction = directions[key];
      if (direction) {
        event.preventDefault();
        if (!heldDirection.current) {
          move(direction);
          lastMovementAt.current = performance.now();
        }
        heldDirection.current = direction;
        if (movementReleaseTimer.current) window.clearTimeout(movementReleaseTimer.current);
        movementReleaseTimer.current = window.setTimeout(() => {
          heldDirection.current = null;
          setIsMoving(false);
        }, 140);
        return;
      }
      if (key === "e" || key === " ") {
        event.preventDefault();
        action();
      }
      if (key === "p") {
        event.preventDefault();
        pause();
      }
      const equipment: Partial<Record<string, RescueTool>> = {
        "1": "wrench",
        "2": "coffee",
        "3": "gun",
        "4": "ammo",
      };
      if (equipment[key]) {
        event.preventDefault();
        select(equipment[key]);
      }
      if (key === "g") {
        event.preventDefault();
        setShowCollisionMap((current) => !current);
      }
      if (
        (game.status === "ready" || game.status === "won" || game.status === "gameover") &&
        key === "enter"
      ) {
        event.preventDefault();
        start();
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      const key = event.key.toLocaleLowerCase();
      if (["arrowdown", "arrowleft", "arrowright", "arrowup", "a", "d", "s", "w"].includes(key)) {
        heldDirection.current = null;
        if (movementReleaseTimer.current) window.clearTimeout(movementReleaseTimer.current);
        setIsMoving(false);
      }
    }

    function stopMovement() {
      heldDirection.current = null;
      if (movementReleaseTimer.current) window.clearTimeout(movementReleaseTimer.current);
      setIsMoving(false);
    }

    movementFrame.current = window.requestAnimationFrame(animateMovement);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", stopMovement);
    return () => {
      heldDirection.current = null;
      if (movementReleaseTimer.current) window.clearTimeout(movementReleaseTimer.current);
      if (movementFrame.current) window.cancelAnimationFrame(movementFrame.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", stopMovement);
    };
  }, [action, game.status, move, pause, select, start]);

  return {
    actions: {
      action,
      chooseBug,
      chooseCoffee,
      chooseSystem,
      move,
      pause,
      select,
      start,
      toggleCollisionMap: () => setShowCollisionMap((current) => !current),
      worldClick,
    },
    animation: { action: actionAnimation, isMoving, showCollisionMap },
    game,
    highScore,
  };
}
