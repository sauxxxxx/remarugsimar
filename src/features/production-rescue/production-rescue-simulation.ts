import type { Point, RescueState } from "./production-rescue.types";
import {
  distanceBetween,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./production-rescue-world";

const PLAYER_NAVIGATION_SPEED = 190;
const BUG_NAVIGATION_SPEED = 62;

function movementMultiplier(energy: number) {
  if (energy >= 80) return 1;
  if (energy >= 50) return 0.86;
  if (energy >= 20) return 0.68;
  return 0.46;
}

function repairRate(energy: number) {
  if (energy >= 80) return 30;
  if (energy >= 50) return 24;
  if (energy >= 20) return 17;
  return 10;
}

function moveToward(current: Point, target: Point, distance: number) {
  const remaining = distanceBetween(current, target);
  if (remaining <= distance) return target;
  return {
    x: current.x + ((target.x - current.x) / remaining) * distance,
    y: current.y + ((target.y - current.y) / remaining) * distance,
  };
}

function collectPickups(state: RescueState) {
  const collected = state.pickups.filter(
    (pickup) => distanceBetween(pickup, state.player) <= 38,
  );
  if (!collected.length) return state;
  return {
    ...state,
    ammoPacks: state.ammoPacks + collected.length,
    message: `Ammo pack collected. Press 4 to load ${collected.length === 1 ? "it" : "them"}.`,
    pickups: state.pickups.filter(
      (pickup) => !collected.some((item) => item.id === pickup.id),
    ),
    score: state.score + collected.length * 40,
  };
}

export function damageBug(
  state: RescueState,
  bugId: number,
  damage: number,
  source: string,
) {
  const target = state.bugs.find((bug) => bug.id === bugId);
  if (!target) return state;
  const defeated = target.health - damage <= 0;
  return {
    ...state,
    bugs: defeated
      ? state.bugs.filter((bug) => bug.id !== bugId)
      : state.bugs.map((bug) =>
          bug.id === bugId ? { ...bug, health: bug.health - damage } : bug,
        ),
    combo: defeated ? state.combo + 1 : state.combo,
    message: defeated ? `${source}: Game Bug eliminated.` : `${source}: direct hit.`,
    score: state.score + (defeated ? 180 + state.combo * 20 : 45),
  };
}

export function finishPendingAction(state: RescueState) {
  const pending = state.pendingAction;
  if (!pending) return state;

  if (pending.kind === "coffee") {
    return {
      ...state,
      coffee: Math.min(3, state.coffee + 1),
      message: state.coffee >= 3 ? "Work bag is already full of coffee." : "Coffee acquired.",
      pendingAction: null,
    };
  }

  if (pending.kind === "melee") {
    const bug = state.bugs.find((item) => item.id === pending.bugId);
    if (!bug || distanceBetween(bug, state.player) > 82) {
      return { ...state, message: "The Game Bug moved out of wrench range.", pendingAction: null };
    }
    return damageBug({ ...state, pendingAction: null }, bug.id, 1, "Wrench strike");
  }

  const system = state.systems.find((item) => item.id === pending.systemId);
  if (!system || system.health === "healthy") {
    return { ...state, message: "That equipment is already stable.", pendingAction: null };
  }
  return {
    ...state,
    message: `Repairing ${system.label}…`,
    pendingAction: null,
    repairJob: { progress: 0, systemId: system.id },
  };
}

function advanceNavigation(state: RescueState, deltaSeconds: number) {
  if (!state.navigation.length || state.repairJob) return state;
  const target = state.navigation[0];
  const player = moveToward(
    state.player,
    target,
    PLAYER_NAVIGATION_SPEED * movementMultiplier(state.energy) * deltaSeconds,
  );
  const reached = distanceBetween(player, target) < 1;
  const navigation = reached ? state.navigation.slice(1) : state.navigation;
  const next = {
    ...state,
    navigation,
    player: {
      ...player,
      facing: Math.abs(target.x - state.player.x) > Math.abs(target.y - state.player.y)
        ? target.x < state.player.x ? "left" as const : "right" as const
        : target.y < state.player.y ? "up" as const : "down" as const,
    },
  };
  return reached && navigation.length === 0 ? finishPendingAction(next) : next;
}

function advanceRepairs(state: RescueState, deltaSeconds: number) {
  if (!state.repairJob) return state;
  const progress = state.repairJob.progress + repairRate(state.energy) * deltaSeconds;
  if (progress < 100) {
    return { ...state, repairJob: { ...state.repairJob, progress } };
  }
  const repaired = state.systems.find((system) => system.id === state.repairJob?.systemId);
  return {
    ...state,
    combo: state.combo + 1,
    message: `${repaired?.label ?? "Equipment"} repair complete.`,
    repairJob: null,
    repairs: state.repairs + 1,
    score: state.score + 220 + state.combo * 25,
    systems: state.systems.map((system) =>
      system.id === repaired?.id
        ? { ...system, age: 0, health: "healthy" as const, incident: null }
        : system,
    ),
    uptime: Math.min(100, state.uptime + 7),
  };
}

function advanceProjectiles(state: RescueState, deltaSeconds: number) {
  let bugs = state.bugs;
  let score = state.score;
  let message = state.message;
  const projectiles = state.projectiles
    .map((projectile) => ({
      ...projectile,
      x: projectile.x + projectile.velocityX * deltaSeconds,
      y: projectile.y + projectile.velocityY * deltaSeconds,
    }))
    .filter((projectile) => {
      const hit = bugs.find((bug) => distanceBetween(bug, projectile) <= 45);
      if (hit) {
        const defeated = hit.health <= 2;
        bugs = defeated
          ? bugs.filter((bug) => bug.id !== hit.id)
          : bugs.map((bug) => bug.id === hit.id ? { ...bug, health: bug.health - 2 } : bug);
        score += defeated ? 180 : 45;
        message = defeated ? "Bug Gun: Game Bug eliminated." : "Bug Gun: direct hit.";
        return false;
      }
      return (
        projectile.x >= 0 &&
        projectile.x <= WORLD_WIDTH &&
        projectile.y >= 0 &&
        projectile.y <= WORLD_HEIGHT
      );
    });
  return { ...state, bugs, message, projectiles, score };
}

function advanceBugs(state: RescueState, deltaSeconds: number) {
  let systems = state.systems;
  const bugs = state.bugs.map((bug) => {
    const waypoint = bug.path[bug.pathIndex];
    if (!waypoint) {
      systems = systems.map((system) =>
        system.id === bug.targetId && system.health === "healthy"
          ? { ...system, age: 0, health: "warning" as const, incident: "malware" as const }
          : system,
      );
      return bug;
    }
    const entersServerRoom = bug.targetId.startsWith("rack") && bug.pathIndex >= 4;
    if (entersServerRoom && !state.doorOpen) return bug;
    const point = moveToward(bug, waypoint, BUG_NAVIGATION_SPEED * deltaSeconds);
    const reached = distanceBetween(point, waypoint) < 1;
    return { ...bug, ...point, pathIndex: reached ? bug.pathIndex + 1 : bug.pathIndex };
  });
  return { ...state, bugs, systems };
}

export function advanceRescueMotion(state: RescueState, deltaSeconds = 0.1): RescueState {
  if (state.status !== "playing") return state;
  return collectPickups(
    advanceRepairs(
      advanceProjectiles(
        advanceBugs(
          advanceNavigation(state, deltaSeconds),
          deltaSeconds,
        ),
        deltaSeconds,
      ),
      deltaSeconds,
    ),
  );
}
