export type SystemTypePhase = "gameover" | "idle" | "paused" | "running" | "scanning" | "victory";

export type SystemTypeFeedbackTone = "critical" | "danger" | "perfect" | "success" | "warning";

export type SystemTypeFeedback = {
  at: number;
  id: number;
  text: string;
  tone: SystemTypeFeedbackTone;
};

export type SystemTypeThreatKind =
  | "deadlock"
  | "memory"
  | "rollback"
  | "runtime"
  | "timeout";

export type SystemTypeThreat = {
  errors: number;
  id: number;
  kind: SystemTypeThreatKind;
  lane: number;
  speed: number;
  tier: "critical" | "elite" | "standard";
  typed: number;
  word: string;
  x: number;
};

export type SystemTypeShot = {
  age: number;
  id: number;
  targetX: number;
  targetY: number;
};

export type SystemTypeBurst = {
  age: number;
  id: number;
  tone: "error" | "success";
  x: number;
  y: number;
};

export type SystemTypeState = {
  accuracy: number;
  bursts: SystemTypeBurst[];
  combo: number;
  correctKeys: number;
  difficulty: number;
  eliminated: number;
  elapsed: number;
  feedback: SystemTypeFeedback | null;
  health: number;
  highScore: number;
  highestCombo: number;
  impacts: number;
  lastId: number;
  mistakes: number;
  nextSpawnAt: number;
  perfectKills: number;
  phase: SystemTypePhase;
  refactorCharge: number;
  scanElapsed: number;
  score: number;
  shots: SystemTypeShot[];
  targetId: number | null;
  threats: SystemTypeThreat[];
  totalKeys: number;
  wave: number;
};

export type SystemTypeSnapshot = Pick<
  SystemTypeState,
  | "accuracy"
  | "combo"
  | "health"
  | "highScore"
  | "phase"
  | "refactorCharge"
  | "score"
  | "wave"
> & {
  activeWord: string;
  typedLength: number;
  wpm: number;
};
