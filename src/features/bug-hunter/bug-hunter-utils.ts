import type { AlertTone, BugHunterAlert, Point } from "./bug-hunter.types";

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function direction(from: Point, to: Point) {
  const length = distance(from, to) || 1;
  return { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
}

export function nextAlert(
  alerts: BugHunterAlert[],
  id: number,
  message: string,
  tone: AlertTone,
) {
  return [{ id, message, tone, ttl: 5200 }, ...alerts].slice(0, 5);
}

export function seededValue(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
