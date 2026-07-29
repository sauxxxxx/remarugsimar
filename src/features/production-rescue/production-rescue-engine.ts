import {
  AMMO_PICKUP_SPAWNS,
  COFFEE_STATION,
  INITIAL_SYSTEMS,
  RESCUE_DURATION,
  TOOL_LABEL,
} from "./production-rescue.constants";
import { findWorldPath } from "./production-rescue-pathfinding";
import {
  advanceRescueMotion,
  damageBug,
  finishPendingAction,
} from "./production-rescue-simulation";
import type {
  Direction,
  IncidentKind,
  PendingAction,
  Point,
  RescueBug,
  RescueState,
  RescueSystem,
  RescueTool,
} from "./production-rescue.types";
import {
  BUG_SPAWNS,
  buildBugPath,
  canOccupy,
  distanceBetween,
  getSystemInteractionPoint,
  isInsideDoorway,
  isNearServerDoor,
  PLAYER_STEP,
} from "./production-rescue-world";

const INCIDENTS: IncidentKind[] = ["hardware", "malware", "fire"];
const PROJECTILE_SPEED = 680;

const MOVES: Record<Direction, Point> = {
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
};

function randomItem<T>(items: T[], random = Math.random) {
  return items[Math.floor(random() * items.length)];
}

function movementMultiplier(energy: number) {
  if (energy >= 80) return 1;
  if (energy >= 50) return 0.86;
  if (energy >= 20) return 0.68;
  return 0.46;
}

function failSystem(
  systems: RescueSystem[],
  systemId: string,
  incident: IncidentKind,
  critical = false,
) {
  return systems.map((system) =>
    system.id === systemId
      ? {
          ...system,
          age: critical ? 18 : 0,
          health: critical ? "critical" as const : "warning" as const,
          incident,
        }
      : system,
  );
}

function spawnIncident(systems: RescueSystem[], random = Math.random) {
  if (systems.filter((system) => system.health !== "healthy").length >= 3) return systems;
  const target = randomItem(
    systems.filter((system) => system.health === "healthy"),
    random,
  );
  return target
    ? failSystem(systems, target.id, randomItem(INCIDENTS, random))
    : systems;
}

function createBug(state: RescueState, random = Math.random): RescueBug | null {
  const target = randomItem(state.systems, random);
  const spawn = randomItem(BUG_SPAWNS, random);
  if (!target || !spawn) return null;
  return {
    ...spawn,
    health: 3,
    id: state.nextBugId,
    path: buildBugPath(spawn, target.id),
    pathIndex: 1,
    targetId: target.id,
  };
}

export function createRescueGame(status: RescueState["status"] = "ready"): RescueState {
  return {
    activeTool: "wrench",
    ammo: 6,
    ammoPacks: 0,
    boost: 0,
    bugs: [],
    coffee: 1,
    combo: 0,
    doorOpen: false,
    elapsedTicks: 0,
    energy: 86,
    finalWaveStarted: false,
    lastTickAt: status === "playing" ? Date.now() : null,
    message: "Wrench equipped. Keep production above 70%.",
    navigation: [],
    nextBugId: 1,
    nextPickupId: 1,
    nextProjectileId: 1,
    pendingAction: null,
    pickups: [],
    player: { facing: "up", x: 765, y: 875 },
    projectiles: [],
    repairJob: null,
    repairs: 0,
    score: 0,
    status,
    systems: INITIAL_SYSTEMS.map((system) => ({ ...system })),
    timeLeft: RESCUE_DURATION,
    uptime: 100,
  };
}

export function movePlayer(state: RescueState, direction: Direction): RescueState {
  if (state.status !== "playing") return state;
  const vector = MOVES[direction];
  const distance = PLAYER_STEP * movementMultiplier(state.energy);
  const next = {
    x: state.player.x + vector.x * distance,
    y: state.player.y + vector.y * distance,
  };
  return canOccupy(next, state.doorOpen)
    ? {
        ...state,
        navigation: [],
        pendingAction: null,
        player: { ...next, facing: direction },
        repairJob: null,
      }
    : { ...state, player: { ...state.player, facing: direction } };
}

export function selectEquipment(state: RescueState, tool: RescueTool): RescueState {
  if (state.status !== "playing") return state;
  return {
    ...state,
    activeTool: tool,
    message: `${TOOL_LABEL[tool]} selected.`,
  };
}

function navigate(
  state: RescueState,
  destination: Point,
  pendingAction: PendingAction | null,
) {
  const navigation = findWorldPath(state.player, destination, state.doorOpen);
  return navigation.length
    ? { ...state, message: "Moving to target…", navigation, pendingAction, repairJob: null }
    : { ...state, message: "No safe route to that location." };
}

export function targetSystem(state: RescueState, systemId: string): RescueState {
  if (state.status !== "playing") return state;
  if (state.activeTool !== "wrench") {
    return { ...state, message: "Select the repair wrench with 1." };
  }
  const system = state.systems.find((item) => item.id === systemId);
  const destination = getSystemInteractionPoint(systemId);
  if (!system || !destination || system.health === "healthy") {
    return { ...state, message: "That equipment is already stable." };
  }
  if (systemId.startsWith("rack") && !state.doorOpen) {
    return navigate(
      { ...state, message: "Open the server-room door first." },
      { x: 765, y: 500 },
      null,
    );
  }
  return navigate(state, destination, { kind: "repair", systemId });
}

export function targetCoffeeMachine(state: RescueState): RescueState {
  if (state.status !== "playing") return state;
  return navigate(state, COFFEE_STATION, { kind: "coffee" });
}

export function targetBug(state: RescueState, bugId: number): RescueState {
  if (state.status !== "playing") return state;
  const bug = state.bugs.find((item) => item.id === bugId);
  if (!bug) return state;
  if (state.activeTool === "gun") return shoot(state, bug);
  if (state.activeTool !== "wrench") {
    return { ...state, message: "Use the Bug Gun or repair wrench." };
  }
  return navigate(state, bug, { bugId, kind: "melee" });
}

export function shoot(state: RescueState, target: Point): RescueState {
  if (state.status !== "playing" || state.activeTool !== "gun") return state;
  if (state.ammo <= 0) return { ...state, message: "Bug Gun empty. Load an ammo pack with 4." };
  const distance = Math.max(1, distanceBetween(state.player, target));
  return {
    ...state,
    ammo: state.ammo - 1,
    message: "Bug Gun fired.",
    nextProjectileId: state.nextProjectileId + 1,
    projectiles: [
      ...state.projectiles,
      {
        id: state.nextProjectileId,
        velocityX: ((target.x - state.player.x) / distance) * PROJECTILE_SPEED,
        velocityY: ((target.y - state.player.y) / distance) * PROJECTILE_SPEED,
        x: state.player.x,
        y: state.player.y,
      },
    ],
  };
}

export function activateSelectedEquipment(state: RescueState): RescueState {
  if (state.activeTool === "coffee") {
    if (state.coffee <= 0) return { ...state, message: "No coffee in the work bag." };
    return {
      ...state,
      coffee: state.coffee - 1,
      energy: Math.min(100, state.energy + 38),
      message: "Coffee used. Energy restored.",
    };
  }
  if (state.activeTool === "ammo") {
    if (state.ammoPacks <= 0) return { ...state, message: "No ammo packs available." };
    return {
      ...state,
      ammo: state.ammo + 6,
      ammoPacks: state.ammoPacks - 1,
      message: "Bug Gun reloaded with 6 rounds.",
    };
  }
  return state;
}

export function navigateTo(state: RescueState, point: Point): RescueState {
  if (state.activeTool === "gun") return shoot(state, point);
  if (state.activeTool === "coffee" || state.activeTool === "ammo") {
    return activateSelectedEquipment(state);
  }
  return navigate(state, point, null);
}

export function interact(state: RescueState): RescueState {
  if (state.status !== "playing") return state;
  if (isNearServerDoor(state.player)) {
    if (state.doorOpen && isInsideDoorway(state.player)) {
      return { ...state, message: "Step clear of the doorway before closing it." };
    }
    return {
      ...state,
      doorOpen: !state.doorOpen,
      message: state.doorOpen ? "Server-room door closed." : "Server-room door open.",
      navigation: [],
    };
  }
  if (distanceBetween(state.player, COFFEE_STATION) <= 72) {
    return finishPendingAction({ ...state, pendingAction: { kind: "coffee" } });
  }
  const system = state.systems.find((item) => {
    const point = getSystemInteractionPoint(item.id);
    return item.health !== "healthy" && point && distanceBetween(point, state.player) <= 78;
  });
  if (system && state.activeTool === "wrench") {
    return finishPendingAction({
      ...state,
      pendingAction: { kind: "repair", systemId: system.id },
    });
  }
  const bug = state.bugs.find((item) => distanceBetween(item, state.player) <= 82);
  if (bug && state.activeTool === "wrench") {
    return damageBug(state, bug.id, 1, "Wrench strike");
  }
  return activateSelectedEquipment({ ...state, message: "Nothing nearby needs interaction." });
}

export function tickRescueGame(
  state: RescueState,
  random = Math.random,
  now = Date.now(),
): RescueState {
  if (state.status !== "playing") return state;
  const deltaSeconds = state.lastTickAt
    ? Math.max(0, Math.min(1.5, (now - state.lastTickAt) / 1000))
    : 1;
  const elapsedTicks = state.elapsedTicks + deltaSeconds;
  const elapsedSecond = Math.floor(elapsedTicks);
  const previousSecond = Math.floor(state.elapsedTicks);
  const enteredNewSecond = elapsedSecond > previousSecond;
  const timeLeft = Math.max(0, state.timeLeft - deltaSeconds);
  let systems = state.systems.map((system) => {
    if (system.health === "healthy") return system;
    const age = system.age + deltaSeconds;
    return { ...system, age, health: age >= 18 ? "critical" as const : system.health };
  });
  let bugs = state.bugs;
  let pickups = state.pickups;
  let nextBugId = state.nextBugId;
  let nextPickupId = state.nextPickupId;
  let message = state.message;

  if (enteredNewSecond && elapsedSecond >= 8 && elapsedSecond % 14 === 0) {
    systems = spawnIncident(systems, random);
    message = "Server failure detected. Select the wrench and repair it.";
  }
  const bugInterval = Math.max(8, 16 - Math.floor(elapsedSecond / 24) * 2);
  if (
    enteredNewSecond &&
    elapsedSecond >= 12 &&
    elapsedSecond % bugInterval === 0 &&
    bugs.length < 6
  ) {
    const bug = createBug({ ...state, systems }, random);
    if (bug) {
      bugs = [...bugs, bug];
      nextBugId += 1;
      message = "Bug infestation started.";
    }
  }
  if (enteredNewSecond && elapsedSecond > 0 && elapsedSecond % 18 === 0 && pickups.length < 2) {
    const spawn = randomItem(AMMO_PICKUP_SPAWNS, random);
    if (spawn) {
      pickups = [...pickups, { ...spawn, id: nextPickupId, kind: "ammo" }];
      nextPickupId += 1;
      message = "Ammo pack detected on the facility floor.";
    }
  }

  const active = systems.filter((system) => system.health !== "healthy").length;
  const critical = systems.filter((system) => system.health === "critical").length;
  const attackingBugs = bugs.filter((bug) => bug.pathIndex >= bug.path.length).length;
  const uptime = Math.max(
    0,
    state.uptime -
      (active * 0.07 + critical * 0.13 + attackingBugs * 0.04) * deltaSeconds,
  );
  const energy = Math.max(0, state.energy - 1.05 * deltaSeconds);
  const status =
    uptime <= 0 || bugs.length >= 7
      ? "gameover"
      : timeLeft <= 0
        ? uptime >= 70 ? "won" : "gameover"
        : state.status;

  return {
    ...state,
    bugs,
    elapsedTicks,
    energy,
    lastTickAt: now,
    message: energy < 20 && state.energy >= 20 ? "Energy critical. Use coffee with 2." : message,
    nextBugId,
    nextPickupId,
    pickups,
    score: state.score + (active === 0 ? 2 : 0),
    status,
    systems,
    timeLeft,
    uptime,
  };
}

export function toggleRescuePause(state: RescueState): RescueState {
  if (state.status === "playing") return { ...state, status: "paused", message: "Shift paused." };
  if (state.status === "paused") {
    return {
      ...state,
      lastTickAt: Date.now(),
      message: "Shift resumed.",
      status: "playing",
    };
  }
  return state;
}

export { advanceRescueMotion };
