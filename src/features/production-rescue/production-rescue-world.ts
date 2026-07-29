import type { Point, WorldRect } from "./production-rescue.types";

export const WORLD_WIDTH = 1536;
export const WORLD_HEIGHT = 1024;
export const PLAYER_RADIUS = 17;
export const PLAYER_STEP = 22;
export const BUG_STEP = 44;

export const SERVER_DOOR = {
  interactionPoint: { x: 764, y: 478 },
  passage: { height: 174, id: "server-door", width: 142, x: 693, y: 326 },
} as const;

export const WALKABLE_ZONES: WorldRect[] = [
  { height: 430, id: "main-floor", width: 1425, x: 55, y: 470 },
  { height: 94, id: "main-entrance", width: 148, x: 692, y: 885 },
  { height: 225, id: "left-service-lane", width: 185, x: 240, y: 265 },
  { height: 110, id: "right-service-lane", width: 335, x: 1145, y: 380 },
  { height: 60, id: "server-front-lane", width: 690, x: 445, y: 310 },
];

export const STATIC_OBSTACLES: WorldRect[] = [
  { height: 280, id: "west-desk", width: 370, x: 180, y: 560 },
  { height: 280, id: "east-desk", width: 365, x: 980, y: 560 },
  { height: 245, id: "west-cabinet", width: 96, x: 55, y: 520 },
  { height: 170, id: "east-plant", width: 104, x: 1376, y: 690 },
  { height: 55, id: "server-racks", width: 590, x: 535, y: 270 },
];

export const SYSTEM_INTERACTION_POINTS: Record<string, Point> = {
  "rack-a": { x: 600, y: 350 },
  "rack-b": { x: 770, y: 350 },
  "rack-c": { x: 950, y: 350 },
  "desk-west": { x: 572, y: 660 },
  "desk-east": { x: 958, y: 660 },
  "network-core": { x: 1170, y: 440 },
};

export const BUG_SPAWNS: Point[] = [
  { x: 165, y: 510 },
  { x: 1370, y: 510 },
  { x: 765, y: 875 },
];

function pointInRect(point: Point, rect: WorldRect, radius = 0) {
  return (
    point.x - radius >= rect.x &&
    point.x + radius <= rect.x + rect.width &&
    point.y - radius >= rect.y &&
    point.y + radius <= rect.y + rect.height
  );
}

function circleTouchesRect(point: Point, rect: WorldRect, radius: number) {
  const closestX = Math.max(rect.x, Math.min(point.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(point.y, rect.y + rect.height));
  const deltaX = point.x - closestX;
  const deltaY = point.y - closestY;
  return deltaX * deltaX + deltaY * deltaY < radius * radius;
}

export function canOccupy(point: Point, doorOpen: boolean, radius = PLAYER_RADIUS) {
  const zones = doorOpen
    ? [...WALKABLE_ZONES, SERVER_DOOR.passage]
    : WALKABLE_ZONES;
  if (!zones.some((zone) => pointInRect(point, zone, radius))) return false;
  return !STATIC_OBSTACLES.some((obstacle) => circleTouchesRect(point, obstacle, radius));
}

export function distanceBetween(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function getSystemInteractionPoint(systemId: string) {
  return SYSTEM_INTERACTION_POINTS[systemId];
}

export function isNearServerDoor(point: Point, distance = 82) {
  return distanceBetween(point, SERVER_DOOR.interactionPoint) <= distance;
}

export function isInsideDoorway(point: Point) {
  return pointInRect(point, SERVER_DOOR.passage, PLAYER_RADIUS + 3);
}

export function worldPosition(point: Point) {
  return {
    left: `${(point.x / WORLD_WIDTH) * 100}%`,
    top: `${(point.y / WORLD_HEIGHT) * 100}%`,
  };
}

export function worldRect(rect: WorldRect) {
  return {
    height: `${(rect.height / WORLD_HEIGHT) * 100}%`,
    left: `${(rect.x / WORLD_WIDTH) * 100}%`,
    top: `${(rect.y / WORLD_HEIGHT) * 100}%`,
    width: `${(rect.width / WORLD_WIDTH) * 100}%`,
  };
}

function routeFromSpawn(spawn: Point) {
  if (spawn.x < WORLD_WIDTH / 3) {
    return [{ x: 300, y: 520 }, { x: 760, y: 520 }];
  }
  if (spawn.x > (WORLD_WIDTH / 3) * 2) {
    return [{ x: 1235, y: 520 }, { x: 760, y: 520 }];
  }
  return [{ x: 760, y: 820 }, { x: 760, y: 520 }];
}

export function buildBugPath(spawn: Point, targetId: string) {
  const target = getSystemInteractionPoint(targetId);
  const path = [spawn, ...routeFromSpawn(spawn)];

  if (targetId.startsWith("rack")) {
    path.push(
      { x: 760, y: 455 },
      { x: 760, y: 365 },
      target,
    );
  } else if (targetId === "desk-west") {
    path.push({ x: 650, y: 520 }, { x: 575, y: 590 }, target);
  } else if (targetId === "desk-east") {
    path.push({ x: 875, y: 520 }, { x: 955, y: 590 }, target);
  } else {
    path.push({ x: 1000, y: 520 }, target);
  }

  return path;
}
