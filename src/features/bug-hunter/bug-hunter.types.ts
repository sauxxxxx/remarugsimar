export type BugHunterPhase = "lost" | "paused" | "playing" | "ready" | "won";

export type BugHunterWeapon = "debugger" | "hotfix" | "patch" | "unit-test";

export type EnemyKind =
  | "database-corruption"
  | "deadlock"
  | "infinite-loop"
  | "memory-leak"
  | "null-reference"
  | "race-condition"
  | "stack-overflow";

export type PickupKind = "ammo" | "coffee" | "energy-cell" | "patch" | "repair-kit";

export type AlertTone = "error" | "info" | "success" | "warning";

export type Point = {
  x: number;
  y: number;
};

export type BugHunterInput = {
  down: boolean;
  left: boolean;
  repair: boolean;
  right: boolean;
  up: boolean;
};

export type BugHunterPlayer = Point & {
  direction: "down" | "left" | "right" | "up";
  energy: number;
  health: number;
  level: number;
  weapon: BugHunterWeapon;
  xp: number;
  xpTarget: number;
};

export type BugHunterEnemy = Point & {
  age: number;
  damage: number;
  hp: number;
  id: number;
  kind: EnemyKind;
  maxHp: number;
  speed: number;
};

export type BugHunterNode = Point & {
  health: number;
  id: string;
  isFaulted: boolean;
  label: string;
};

export type BugHunterProjectile = Point & {
  damage: number;
  id: number;
  kind: BugHunterWeapon;
  radius: number;
  ttl: number;
  vx: number;
  vy: number;
};

export type BugHunterPickup = Point & {
  id: number;
  kind: PickupKind;
};

export type BugHunterAlert = {
  id: number;
  message: string;
  tone: AlertTone;
  ttl: number;
};

export type BugHunterInventory = {
  ammo: number;
  coffee: number;
  energyCells: number;
  patches: number;
  repairKits: number;
};

export type BugHunterState = {
  alerts: BugHunterAlert[];
  elapsed: number;
  enemies: BugHunterEnemy[];
  highScore: number;
  incidentCount: number;
  inventory: BugHunterInventory;
  kills: number;
  lastId: number;
  lastShotAt: number;
  levelIndex: number;
  nextIncidentAt: number;
  nextSpawnAt: number;
  nodes: BugHunterNode[];
  phase: BugHunterPhase;
  pickups: BugHunterPickup[];
  player: BugHunterPlayer;
  projectiles: BugHunterProjectile[];
  remaining: number;
  repairs: number;
  refactorCharge: number;
  score: number;
  uptime: number;
};

export type BugHunterLevel = {
  code: string;
  duration: number;
  enemyPool: EnemyKind[];
  id: number;
  name: string;
  objective: string;
  systemTarget: string;
  tint: string;
};
