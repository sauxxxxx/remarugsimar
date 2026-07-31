import type {
  BugHunterLevel,
  BugHunterNode,
  BugHunterWeapon,
  EnemyKind,
  PickupKind,
} from "./bug-hunter.types";

export const BUG_HUNTER_LEVELS: BugHunterLevel[] = [
  {
    code: "AUTH-01",
    duration: 75,
    enemyPool: ["memory-leak", "null-reference", "race-condition"],
    id: 1,
    name: "Authentication Service",
    objective: "Restore access nodes and maintain uptime above 80%.",
    systemTarget: "access nodes",
    tint: "#58a6ff",
  },
  {
    code: "DATA-02",
    duration: 80,
    enemyPool: ["memory-leak", "deadlock", "database-corruption"],
    id: 2,
    name: "Database Layer",
    objective: "Repair database clusters before corruption spreads.",
    systemTarget: "database clusters",
    tint: "#a371f7",
  },
  {
    code: "API-03",
    duration: 85,
    enemyPool: ["infinite-loop", "null-reference", "race-condition"],
    id: 3,
    name: "API Gateway",
    objective: "Keep routing nodes online during the request surge.",
    systemTarget: "routing nodes",
    tint: "#39c5cf",
  },
  {
    code: "PAY-04",
    duration: 90,
    enemyPool: ["deadlock", "race-condition", "stack-overflow"],
    id: 4,
    name: "Payment System",
    objective: "Protect transaction processors and encrypted tunnels.",
    systemTarget: "transaction nodes",
    tint: "#d29922",
  },
  {
    code: "MSG-05",
    duration: 90,
    enemyPool: ["infinite-loop", "memory-leak", "null-reference"],
    id: 5,
    name: "Notification Service",
    objective: "Clear queue failures and restore delivery workers.",
    systemTarget: "delivery workers",
    tint: "#db61a2",
  },
  {
    code: "OBS-06",
    duration: 95,
    enemyPool: ["database-corruption", "memory-leak", "race-condition"],
    id: 6,
    name: "Analytics Engine",
    objective: "Repair ingest nodes and preserve telemetry flow.",
    systemTarget: "ingest nodes",
    tint: "#3fb950",
  },
  {
    code: "CLD-07",
    duration: 100,
    enemyPool: ["deadlock", "infinite-loop", "stack-overflow"],
    id: 7,
    name: "Cloud Infrastructure",
    objective: "Stabilize distributed clusters under peak load.",
    systemTarget: "cloud clusters",
    tint: "#58a6ff",
  },
  {
    code: "CORE-08",
    duration: 110,
    enemyPool: [
      "database-corruption",
      "deadlock",
      "infinite-loop",
      "memory-leak",
      "null-reference",
      "race-condition",
      "stack-overflow",
    ],
    id: 8,
    name: "Core Production Cluster",
    objective: "Survive the system failure and preserve production.",
    systemTarget: "production core",
    tint: "#f85149",
  },
];

export const ENEMY_DEFINITIONS: Record<
  EnemyKind,
  { damage: number; hp: number; label: string; score: number; speed: number }
> = {
  "memory-leak": { damage: 5, hp: 42, label: "Memory Leak", score: 110, speed: 3.2 },
  "null-reference": { damage: 7, hp: 34, label: "Null Reference", score: 140, speed: 4.2 },
  "infinite-loop": { damage: 6, hp: 48, label: "Infinite Loop", score: 130, speed: 5.5 },
  "race-condition": { damage: 8, hp: 30, label: "Race Condition", score: 160, speed: 7.4 },
  "stack-overflow": { damage: 12, hp: 125, label: "Stack Overflow", score: 320, speed: 2.2 },
  deadlock: { damage: 9, hp: 75, label: "Deadlock", score: 210, speed: 0 },
  "database-corruption": {
    damage: 10,
    hp: 92,
    label: "Database Corruption",
    score: 260,
    speed: 2.8,
  },
};

export const WEAPON_DEFINITIONS: Record<
  BugHunterWeapon,
  { cooldown: number; damage: number; label: string; radius: number; speed: number }
> = {
  debugger: { cooldown: 260, damage: 22, label: "Debugger", radius: 2.2, speed: 48 },
  "unit-test": { cooldown: 440, damage: 42, label: "Unit Test", radius: 2.5, speed: 42 },
  hotfix: { cooldown: 850, damage: 64, label: "Hotfix", radius: 11, speed: 30 },
  patch: { cooldown: 1100, damage: 0, label: "Patch Deployment", radius: 15, speed: 0 },
};

export const PICKUP_LABELS: Record<PickupKind, string> = {
  ammo: "Debug cartridges",
  coffee: "Coffee",
  "energy-cell": "Energy cell",
  patch: "Software patch",
  "repair-kit": "Repair kit",
};

export const SYSTEM_NODES: BugHunterNode[] = [
  { health: 100, id: "auth", isFaulted: false, label: "Authentication", x: 21, y: 23 },
  { health: 100, id: "database", isFaulted: false, label: "Database cluster", x: 79, y: 24 },
  { health: 100, id: "gateway", isFaulted: false, label: "API gateway", x: 50, y: 50 },
  { health: 100, id: "observability", isFaulted: false, label: "Observability", x: 22, y: 77 },
  { health: 100, id: "deployment", isFaulted: false, label: "Deployment node", x: 78, y: 76 },
];

