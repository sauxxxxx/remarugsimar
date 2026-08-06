import type { SystemTypeThreatKind } from "./system-type.types";

export const SYSTEM_TYPE_WORDS: Record<SystemTypeThreatKind, readonly string[]> = {
  deadlock: ["deadlock", "mutex", "blocked", "awaiting", "contention"],
  memory: ["overflow", "memory", "leaking", "buffer", "allocation"],
  rollback: ["rollback", "revert", "migration", "snapshot", "restore"],
  runtime: ["undefined", "exception", "runtime", "invalid", "reference"],
  timeout: ["timeout", "latency", "gateway", "request", "network"],
};

export const THREAT_KINDS = Object.keys(SYSTEM_TYPE_WORDS) as SystemTypeThreatKind[];

export const SYSTEM_TYPE_LANES = [0.23, 0.36, 0.5, 0.64, 0.77] as const;

export const SHOOTER_POSITION = { x: 0.165, y: 0.42 } as const;
