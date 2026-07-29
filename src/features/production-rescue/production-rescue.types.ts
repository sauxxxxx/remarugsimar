export type RescueStatus = "ready" | "playing" | "paused" | "won" | "gameover";

export type Direction = "down" | "left" | "right" | "up";

export type Point = {
  x: number;
  y: number;
};

export type WorldRect = {
  height: number;
  id: string;
  width: number;
  x: number;
  y: number;
};

export type RescueTool = "ammo" | "coffee" | "gun" | "wrench";

export type RescueActionAnimation = "gun" | "interact" | "wrench";

export type IncidentKind = "fire" | "hardware" | "malware";

export type SystemHealth = "critical" | "healthy" | "warning";

export type RescueSystem = Point & {
  age: number;
  health: SystemHealth;
  id: string;
  incident: IncidentKind | null;
  label: string;
};

export type RescueBug = Point & {
  health: number;
  id: number;
  path: Point[];
  pathIndex: number;
  targetId: string;
};

export type RescueProjectile = Point & {
  id: number;
  velocityX: number;
  velocityY: number;
};

export type PlayerState = Point & {
  facing: Direction;
};

export type RescuePickup = Point & {
  id: number;
  kind: "ammo";
};

export type PendingAction =
  | { kind: "coffee" }
  | { bugId: number; kind: "melee" }
  | { kind: "repair"; systemId: string };

export type RepairJob = {
  progress: number;
  systemId: string;
};

export type RescueState = {
  activeTool: RescueTool;
  ammo: number;
  ammoPacks: number;
  boost: number;
  bugs: RescueBug[];
  coffee: number;
  combo: number;
  doorOpen: boolean;
  energy: number;
  elapsedTicks: number;
  finalWaveStarted: boolean;
  lastTickAt: number | null;
  message: string;
  navigation: Point[];
  nextBugId: number;
  nextPickupId: number;
  nextProjectileId: number;
  pendingAction: PendingAction | null;
  pickups: RescuePickup[];
  player: PlayerState;
  projectiles: RescueProjectile[];
  repairJob: RepairJob | null;
  repairs: number;
  score: number;
  status: RescueStatus;
  systems: RescueSystem[];
  timeLeft: number;
  uptime: number;
};
