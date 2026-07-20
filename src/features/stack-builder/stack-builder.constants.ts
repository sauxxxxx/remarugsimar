import type { Shape, TechKey } from "./stack-builder.types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 16;

export const TECH_KEYS: TechKey[] = ["FE", "API", "DB", "AI"];

export const TECH_NAMES: Record<TechKey, string> = {
  FE: "Frontend",
  API: "API",
  DB: "Database",
  AI: "AI",
};

export const PIECE_SHAPES: Shape[] = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

export const STACK_BUILDER_COPY = {
  title: "Stack Builder",
  description: "Build a stable software stack, clear complete layers, and keep production running.",
  score: "Score",
  best: "Best",
  lines: "Lines",
  level: "Level",
  next: "Next",
  controls: "Controls",
  move: "Move",
  rotate: "Rotate",
  softDrop: "Soft drop",
  hardDrop: "Hard drop",
  pause: "Pause",
  readyTitle: "Ready to deploy?",
  readyText: "Arrange the stack and complete horizontal layers.",
  start: "Start game",
  paused: "Paused",
  resume: "Resume",
  gameOver: "Deployment failed",
  restart: "Restart",
  close: "Close Stack Builder",
} as const;
