import {
  BUG_HUNTER_LEVELS,
  ENEMY_DEFINITIONS,
  PICKUP_LABELS,
} from "./bug-hunter.data";
import type {
  BugHunterEnemy,
  BugHunterInput,
  BugHunterNode,
  BugHunterPickup,
  BugHunterPlayer,
  BugHunterProjectile,
  BugHunterState,
  PickupKind,
  Point,
} from "./bug-hunter.types";
import { clamp, direction, distance, nextAlert, seededValue } from "./bug-hunter-utils";

const EMPTY_INPUT: BugHunterInput = {
  down: false,
  left: false,
  repair: false,
  right: false,
  up: false,
};

function spawnEnemy(state: BugHunterState, elapsed: number) {
  const level = BUG_HUNTER_LEVELS[state.levelIndex];
  const id = state.lastId + 1;
  const kind = level.enemyPool[id % level.enemyPool.length];
  const definition = ENEMY_DEFINITIONS[kind];
  const side = id % 4;
  const lane = 8 + seededValue(id + elapsed) * 84;
  const point = [
    { x: lane, y: 5 },
    { x: 95, y: lane },
    { x: lane, y: 95 },
    { x: 5, y: lane },
  ][side];
  const enemy: BugHunterEnemy = {
    ...point,
    age: 0,
    damage: definition.damage,
    hp: definition.hp,
    id,
    kind,
    maxHp: definition.hp,
    speed: definition.speed,
  };
  const interval = Math.max(680, 2300 - elapsed / 34 - state.levelIndex * 100);

  return {
    enemies: [...state.enemies, enemy].slice(-24),
    lastId: id,
    nextSpawnAt: elapsed + interval,
  };
}

function createPickup(enemy: BugHunterEnemy, id: number): BugHunterPickup | null {
  const kinds: PickupKind[] = ["ammo", "coffee", "energy-cell", "patch", "repair-kit"];
  if (enemy.id % 3 !== 0) return null;
  return { id, kind: kinds[enemy.id % kinds.length], x: enemy.x, y: enemy.y };
}

function movePlayer(
  state: BugHunterState,
  input: BugHunterInput,
  deltaSeconds: number,
): BugHunterPlayer {
  const horizontal = Number(input.right) - Number(input.left);
  const vertical = Number(input.down) - Number(input.up);
  if (!horizontal && !vertical) return state.player;
  const length = Math.hypot(horizontal, vertical) || 1;
  const energyFactor = state.player.energy < 20 ? 0.58 : state.player.energy < 50 ? 0.78 : 1;
  const speed = 21 * energyFactor * deltaSeconds;

  return {
    ...state.player,
    direction:
      Math.abs(horizontal) > Math.abs(vertical)
        ? horizontal > 0
          ? "right"
          : "left"
        : vertical > 0
          ? "down"
          : "up",
    x: clamp(state.player.x + (horizontal / length) * speed, 4, 96),
    y: clamp(state.player.y + (vertical / length) * speed, 6, 94),
  };
}

function collectPickups(
  pickups: BugHunterPickup[],
  player: BugHunterState["player"],
  inventory: BugHunterState["inventory"],
) {
  const nextInventory = { ...inventory };
  const remaining: BugHunterPickup[] = [];
  const collected: PickupKind[] = [];

  pickups.forEach((pickup) => {
    if (distance(pickup, player) > 4.7) {
      remaining.push(pickup);
      return;
    }
    collected.push(pickup.kind);
    if (pickup.kind === "ammo") nextInventory.ammo += 6;
    if (pickup.kind === "coffee") nextInventory.coffee += 1;
    if (pickup.kind === "energy-cell") nextInventory.energyCells += 1;
    if (pickup.kind === "patch") nextInventory.patches += 1;
    if (pickup.kind === "repair-kit") nextInventory.repairKits += 1;
  });

  return { collected, inventory: nextInventory, pickups: remaining };
}

function nearestNode(nodes: BugHunterNode[], point: Point) {
  return [...nodes].sort((a, b) => distance(a, point) - distance(b, point))[0];
}

export function advanceBugHunterGame(
  state: BugHunterState,
  deltaMs: number,
  input: BugHunterInput = EMPTY_INPUT,
): BugHunterState {
  if (state.phase !== "playing") return state;

  const deltaSeconds = Math.min(deltaMs, 60) / 1000;
  const elapsed = state.elapsed + deltaMs;
  const remaining = Math.max(0, state.remaining - deltaSeconds);
  let lastId = state.lastId;
  let alerts = state.alerts
    .map((alert) => ({ ...alert, ttl: alert.ttl - deltaMs }))
    .filter((alert) => alert.ttl > 0);
  const player = movePlayer(state, input, deltaSeconds);
  player.energy = clamp(player.energy - deltaSeconds * 0.54, 0, 100);
  let nodes = state.nodes.map((node) => ({ ...node }));
  let incidentCount = state.incidentCount;
  let nextIncidentAt = state.nextIncidentAt;
  let nextSpawnAt = state.nextSpawnAt;
  let enemies = state.enemies.map((enemy) => ({ ...enemy, age: enemy.age + deltaMs }));

  if (elapsed >= nextIncidentAt) {
    const nodeIndex = Math.floor(seededValue(elapsed + lastId) * nodes.length);
    const node = nodes[nodeIndex];
    nodes[nodeIndex] = {
      ...node,
      health: clamp(node.health - 34, 0, 100),
      isFaulted: true,
    };
    lastId += 1;
    alerts = nextAlert(alerts, lastId, `${node.label}: service degradation detected`, "error");
    incidentCount += 1;
    nextIncidentAt = elapsed + Math.max(6500, 12000 - state.levelIndex * 450);
  }

  if (elapsed >= nextSpawnAt) {
    const spawned = spawnEnemy({ ...state, enemies, lastId }, elapsed);
    enemies = spawned.enemies;
    lastId = spawned.lastId;
    nextSpawnAt = spawned.nextSpawnAt;
  }

  let playerDamage = 0;
  enemies = enemies.map((enemy) => {
    const next = { ...enemy };
    const target =
      enemy.kind === "database-corruption" || enemy.kind === "memory-leak"
        ? nearestNode(nodes, enemy)
        : player;

    if (enemy.kind === "null-reference") {
      const previousCycle = Math.floor((enemy.age - deltaMs) / 3300);
      const nextCycle = Math.floor(next.age / 3300);
      if (nextCycle > previousCycle) {
        next.x = clamp(target.x + (seededValue(enemy.id + nextCycle) - 0.5) * 24, 5, 95);
        next.y = clamp(target.y + (seededValue(enemy.id * 2 + nextCycle) - 0.5) * 24, 7, 93);
      }
    }

    if (enemy.speed > 0) {
      const vector = direction(enemy, target);
      const jitter =
        enemy.kind === "race-condition" ? Math.sin((enemy.age + enemy.id * 97) / 90) * 2.4 : 0;
      next.x = clamp(next.x + (vector.x * enemy.speed + jitter) * deltaSeconds, 3, 97);
      next.y = clamp(next.y + (vector.y * enemy.speed - jitter) * deltaSeconds, 4, 96);
    }

    if (distance(next, player) < (enemy.kind === "stack-overflow" ? 6 : 4.1)) {
      playerDamage += enemy.damage * deltaSeconds * 0.78;
    }

    const targetNode = nearestNode(nodes, next);
    if (distance(next, targetNode) < 7.5) {
      const nodeIndex = nodes.findIndex((node) => node.id === targetNode.id);
      const damageMultiplier = enemy.kind === "database-corruption" ? 1.5 : 0.62;
      const health = clamp(
        nodes[nodeIndex].health - enemy.damage * damageMultiplier * deltaSeconds,
        0,
        100,
      );
      nodes[nodeIndex] = {
        ...nodes[nodeIndex],
        health,
        isFaulted: health < 66 || nodes[nodeIndex].isFaulted,
      };
    }
    return next;
  });
  player.health = clamp(player.health - playerDamage, 0, 100);

  const movingProjectiles = state.projectiles
    .map((projectile) => ({
      ...projectile,
      ttl: projectile.ttl - deltaMs,
      x: projectile.x + projectile.vx * deltaSeconds,
      y: projectile.y + projectile.vy * deltaSeconds,
    }))
    .filter(
      (projectile) =>
        projectile.ttl > 0 &&
        projectile.x > -5 &&
        projectile.x < 105 &&
        projectile.y > -5 &&
        projectile.y < 105,
    );
  const survivingProjectiles: BugHunterProjectile[] = [];

  movingProjectiles.forEach((projectile) => {
    if (projectile.kind === "patch") {
      nodes = nodes.map((node) =>
        distance(node, projectile) <= projectile.radius
          ? { ...node, health: clamp(node.health + deltaSeconds * 13, 0, 100) }
          : node,
      );
      survivingProjectiles.push(projectile);
      return;
    }

    const directHit = enemies.find(
      (enemy) => enemy.hp > 0 && distance(enemy, projectile) <= projectile.radius + 2,
    );
    if (!directHit) {
      survivingProjectiles.push(projectile);
      return;
    }

    enemies = enemies.map((enemy) => {
      const hit =
        projectile.kind === "hotfix"
          ? distance(enemy, projectile) <= projectile.radius
          : enemy.id === directHit.id;
      return hit ? { ...enemy, hp: enemy.hp - projectile.damage } : enemy;
    });
  });

  let score = state.score;
  let kills = state.kills;
  let refactorCharge = state.refactorCharge;
  let xp = player.xp;
  let pickups = [...state.pickups];
  const defeated = enemies.filter((enemy) => enemy.hp <= 0);
  defeated.forEach((enemy) => {
    const definition = ENEMY_DEFINITIONS[enemy.kind];
    score += definition.score;
    xp += Math.round(definition.score * 0.32);
    kills += 1;
    refactorCharge = clamp(refactorCharge + 12, 0, 100);
    lastId += 1;
    const pickup = createPickup(enemy, lastId);
    if (pickup) pickups.push(pickup);
  });
  enemies = enemies.filter((enemy) => enemy.hp > 0);

  let repairs = state.repairs;
  let uptimeBonus = 0;
  const repairTarget = nearestNode(nodes, player);
  if (input.repair && repairTarget && distance(repairTarget, player) <= 11) {
    const nodeIndex = nodes.findIndex((node) => node.id === repairTarget.id);
    const wasFaulted = nodes[nodeIndex].isFaulted;
    const repairRate = player.energy < 20 ? 15 : player.energy < 50 ? 22 : 30;
    const health = clamp(nodes[nodeIndex].health + repairRate * deltaSeconds, 0, 100);
    nodes[nodeIndex] = {
      ...nodes[nodeIndex],
      health,
      isFaulted: health < 99 ? nodes[nodeIndex].isFaulted : false,
    };
    player.energy = clamp(player.energy - deltaSeconds * 1.7, 0, 100);
    if (wasFaulted && health >= 99) {
      repairs += 1;
      score += 420;
      uptimeBonus += 4;
      lastId += 1;
      alerts = nextAlert(alerts, lastId, `${repairTarget.label}: service restored`, "success");
    }
  }

  const collected = collectPickups(pickups, player, state.inventory);
  pickups = collected.pickups;
  if (collected.collected.length) {
    lastId += 1;
    alerts = nextAlert(
      alerts,
      lastId,
      `${PICKUP_LABELS[collected.collected.at(-1)!]} acquired`,
      "info",
    );
  }

  if (xp >= player.xpTarget) {
    xp -= player.xpTarget;
    player.level += 1;
    player.xpTarget = Math.round(player.xpTarget * 1.34);
    player.health = clamp(player.health + 18, 0, 100);
    player.energy = clamp(player.energy + 22, 0, 100);
    lastId += 1;
    alerts = nextAlert(alerts, lastId, `Engineer level ${player.level} reached`, "success");
  }
  player.xp = xp;

  nodes = nodes.map((node) => ({
    ...node,
    isFaulted: node.health < 62 || node.isFaulted,
  }));
  const offlineNodes = nodes.filter((node) => node.health <= 1).length;
  const faultedNodes = nodes.filter((node) => node.isFaulted).length;
  const uptimeDrain =
    enemies.length * 0.012 * deltaSeconds +
    faultedNodes * 0.038 * deltaSeconds +
    offlineNodes * 0.2 * deltaSeconds;
  const uptime = clamp(state.uptime - uptimeDrain + uptimeBonus, 0, 100);
  let phase: BugHunterState["phase"] = "playing";

  if (uptime <= 0 || player.health <= 0) phase = "lost";
  if (remaining <= 0) phase = uptime >= 70 ? "won" : "lost";
  const highScore = Math.max(state.highScore, score);

  return {
    ...state,
    alerts,
    elapsed,
    enemies,
    highScore,
    incidentCount,
    inventory: collected.inventory,
    kills,
    lastId,
    nextIncidentAt,
    nextSpawnAt,
    nodes,
    phase,
    pickups: pickups.slice(-12),
    player,
    projectiles: survivingProjectiles,
    remaining,
    repairs,
    refactorCharge,
    score,
    uptime,
  };
}
