import {
  BUG_HUNTER_LEVELS,
  PICKUP_LABELS,
  SYSTEM_NODES,
  WEAPON_DEFINITIONS,
} from "./bug-hunter.data";
import type {
  BugHunterProjectile,
  BugHunterState,
  BugHunterWeapon,
  Point,
} from "./bug-hunter.types";
import { clamp, direction, nextAlert } from "./bug-hunter-utils";

export function createBugHunterGame(
  levelIndex = 0,
  phase: BugHunterState["phase"] = "ready",
  highScore = 0,
): BugHunterState {
  const safeLevel = clamp(levelIndex, 0, BUG_HUNTER_LEVELS.length - 1);
  const level = BUG_HUNTER_LEVELS[safeLevel];

  return {
    alerts: [{
      id: 1,
      message: `${level.code} monitoring session initialized`,
      tone: "info",
      ttl: 5200,
    }],
    elapsed: 0,
    enemies: [],
    highScore,
    incidentCount: 0,
    inventory: { ammo: 14, coffee: 2, energyCells: 1, patches: 4, repairKits: 2 },
    kills: 0,
    lastId: 1,
    lastShotAt: -2000,
    levelIndex: safeLevel,
    nextIncidentAt: 9000,
    nextSpawnAt: 1500,
    nodes: SYSTEM_NODES.map((node) => ({ ...node })),
    phase,
    pickups: [],
    player: {
      direction: "down",
      energy: 100,
      health: 100,
      level: 1,
      weapon: "debugger",
      x: 50,
      xp: 0,
      xpTarget: 100,
      y: 67,
    },
    projectiles: [],
    remaining: level.duration,
    repairs: 0,
    refactorCharge: 0,
    score: 0,
    uptime: 100,
  };
}

export function startBugHunterGame(state: BugHunterState) {
  return { ...state, phase: "playing" as const };
}

export function toggleBugHunterPause(state: BugHunterState) {
  if (state.phase === "playing") return { ...state, phase: "paused" as const };
  if (state.phase === "paused") return { ...state, phase: "playing" as const };
  return state;
}

export function selectBugHunterWeapon(state: BugHunterState, weapon: BugHunterWeapon) {
  return { ...state, player: { ...state.player, weapon } };
}

export function activateCodeRefactor(state: BugHunterState): BugHunterState {
  if (state.phase !== "playing" || state.refactorCharge < 100) return state;
  const lastId = state.lastId + 1;
  return {
    ...state,
    alerts: nextAlert(
      state.alerts,
      lastId,
      "Code Refactor deployed: corrupted processes isolated",
      "success",
    ),
    enemies: state.enemies.map((enemy) => ({
      ...enemy,
      hp: enemy.hp - (enemy.kind === "database-corruption" ? 80 : 120),
    })),
    lastId,
    nodes: state.nodes.map((node) => ({
      ...node,
      health: clamp(node.health + 18, 0, 100),
    })),
    refactorCharge: 0,
    uptime: clamp(state.uptime + 6, 0, 100),
  };
}

export function consumeBugHunterItem(
  state: BugHunterState,
  kind: "coffee" | "energy-cell" | "repair-kit",
): BugHunterState {
  const inventory = { ...state.inventory };
  const player = { ...state.player };

  if (kind === "coffee" && inventory.coffee > 0) {
    inventory.coffee -= 1;
    player.energy = clamp(player.energy + 38, 0, 100);
  } else if (kind === "energy-cell" && inventory.energyCells > 0) {
    inventory.energyCells -= 1;
    player.energy = clamp(player.energy + 58, 0, 100);
  } else if (kind === "repair-kit" && inventory.repairKits > 0) {
    inventory.repairKits -= 1;
    player.health = clamp(player.health + 36, 0, 100);
  } else {
    return state;
  }

  const lastId = state.lastId + 1;
  return {
    ...state,
    alerts: nextAlert(state.alerts, lastId, `${PICKUP_LABELS[kind]} applied`, "success"),
    inventory,
    lastId,
    player,
  };
}

export function fireBugHunterWeapon(
  state: BugHunterState,
  target: Point,
): BugHunterState {
  if (state.phase !== "playing") return state;
  const weapon = state.player.weapon;
  const definition = WEAPON_DEFINITIONS[weapon];
  if (state.elapsed - state.lastShotAt < definition.cooldown) return state;

  const inventory = { ...state.inventory };
  if (weapon === "unit-test") {
    if (inventory.ammo <= 0) return state;
    inventory.ammo -= 1;
  }
  if (weapon === "hotfix" || weapon === "patch") {
    if (inventory.patches <= 0) return state;
    inventory.patches -= 1;
  }

  const vector = direction(state.player, target);
  const id = state.lastId + 1;
  const projectile: BugHunterProjectile = {
    damage: definition.damage,
    id,
    kind: weapon,
    radius: definition.radius,
    ttl: weapon === "patch" ? 3200 : 1500,
    vx: weapon === "patch" ? 0 : vector.x * definition.speed,
    vy: weapon === "patch" ? 0 : vector.y * definition.speed,
    x: weapon === "patch" ? target.x : state.player.x,
    y: weapon === "patch" ? target.y : state.player.y,
  };

  return {
    ...state,
    inventory,
    lastId: id,
    lastShotAt: state.elapsed,
    player: {
      ...state.player,
      direction: Math.abs(vector.x) > Math.abs(vector.y)
        ? vector.x > 0 ? "right" : "left"
        : vector.y > 0 ? "down" : "up",
    },
    projectiles: [...state.projectiles, projectile],
  };
}
