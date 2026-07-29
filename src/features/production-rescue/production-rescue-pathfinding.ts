import type { Point } from "./production-rescue.types";
import { canOccupy, distanceBetween, WORLD_HEIGHT, WORLD_WIDTH } from "./production-rescue-world";

const GRID_SIZE = 32;
const DIRECTIONS = [
  { x: GRID_SIZE, y: 0 },
  { x: -GRID_SIZE, y: 0 },
  { x: 0, y: GRID_SIZE },
  { x: 0, y: -GRID_SIZE },
];

function key(point: Point) {
  return `${Math.round(point.x)},${Math.round(point.y)}`;
}

function snap(point: Point) {
  return {
    x: Math.max(GRID_SIZE, Math.min(WORLD_WIDTH - GRID_SIZE, Math.round(point.x / GRID_SIZE) * GRID_SIZE)),
    y: Math.max(GRID_SIZE, Math.min(WORLD_HEIGHT - GRID_SIZE, Math.round(point.y / GRID_SIZE) * GRID_SIZE)),
  };
}

function nearestWalkable(point: Point, doorOpen: boolean) {
  if (canOccupy(point, doorOpen)) return point;
  for (let radius = GRID_SIZE; radius <= GRID_SIZE * 5; radius += GRID_SIZE) {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const candidate = {
        x: point.x + Math.cos(angle) * radius,
        y: point.y + Math.sin(angle) * radius,
      };
      if (canOccupy(candidate, doorOpen)) return candidate;
    }
  }
  return null;
}

function reconstruct(cameFrom: Map<string, Point>, current: Point, destination: Point) {
  const path = [destination];
  let cursor = current;
  while (cameFrom.has(key(cursor))) {
    path.unshift(cursor);
    cursor = cameFrom.get(key(cursor))!;
  }
  return path;
}

export function findWorldPath(start: Point, requestedDestination: Point, doorOpen: boolean) {
  const destination = nearestWalkable(requestedDestination, doorOpen);
  if (!destination) return [];
  const startNode = snap(start);
  const goalNode = snap(destination);
  const open: Point[] = [startNode];
  const cameFrom = new Map<string, Point>();
  const cost = new Map<string, number>([[key(startNode), 0]]);
  const visited = new Set<string>();

  while (open.length) {
    open.sort((a, b) => {
      const aScore = (cost.get(key(a)) ?? Infinity) + distanceBetween(a, goalNode);
      const bScore = (cost.get(key(b)) ?? Infinity) + distanceBetween(b, goalNode);
      return aScore - bScore;
    });
    const current = open.shift()!;
    const currentKey = key(current);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    if (distanceBetween(current, goalNode) <= GRID_SIZE) {
      return reconstruct(cameFrom, current, destination);
    }

    for (const direction of DIRECTIONS) {
      const neighbor = { x: current.x + direction.x, y: current.y + direction.y };
      const neighborKey = key(neighbor);
      if (visited.has(neighborKey) || !canOccupy(neighbor, doorOpen)) continue;
      const nextCost = (cost.get(currentKey) ?? 0) + GRID_SIZE;
      if (nextCost >= (cost.get(neighborKey) ?? Infinity)) continue;
      cost.set(neighborKey, nextCost);
      cameFrom.set(neighborKey, current);
      open.push(neighbor);
    }
  }

  return [];
}
