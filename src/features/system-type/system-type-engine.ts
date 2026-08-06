import {
  SHOOTER_POSITION,
  SYSTEM_TYPE_LANES,
  SYSTEM_TYPE_WORDS,
  THREAT_KINDS,
} from "./system-type.data";
import type {
  SystemTypeBurst,
  SystemTypeShot,
  SystemTypeState,
  SystemTypeThreat,
} from "./system-type.types";

const IMPACT_X = 0.29;
export const SYSTEM_TYPE_OBJECTIVE = 20;
export const SYSTEM_TYPE_SCAN_DURATION = 2400;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function seeded(seed: number) {
  const value = Math.sin(seed * 91.197) * 43758.5453;
  return value - Math.floor(value);
}

function calculateAccuracy(correct: number, total: number) {
  return total ? (correct / total) * 100 : 100;
}

function calculateWpm(state: SystemTypeState) {
  if (state.elapsed < 1000) return 0;
  return Math.round((state.correctKeys / 5) / (state.elapsed / 60000));
}

export function createSystemTypeState(highScore = 0): SystemTypeState {
  return {
    accuracy: 100,
    bursts: [],
    combo: 0,
    correctKeys: 0,
    difficulty: 0,
    eliminated: 0,
    elapsed: 0,
    feedback: null,
    health: 100,
    highScore,
    highestCombo: 0,
    impacts: 0,
    lastId: 0,
    mistakes: 0,
    nextSpawnAt: 900,
    perfectKills: 0,
    phase: "idle",
    refactorCharge: 0,
    scanElapsed: 0,
    score: 0,
    shots: [],
    targetId: null,
    threats: [],
    totalKeys: 0,
    wave: 1,
  };
}

export function startSystemType(state: SystemTypeState): SystemTypeState {
  return state.phase === "idle" ? { ...state, phase: "scanning", scanElapsed: 0 } : state;
}

export function toggleSystemTypePause(state: SystemTypeState): SystemTypeState {
  if (state.phase === "running") return { ...state, phase: "paused" };
  if (state.phase === "paused") return { ...state, phase: "running" };
  return state;
}

function createThreat(state: SystemTypeState): SystemTypeThreat {
  const id = state.lastId + 1;
  const kind = THREAT_KINDS[id % THREAT_KINDS.length];
  const words = SYSTEM_TYPE_WORDS[kind];
  const word = words[Math.floor(seeded(id + state.wave * 3) * words.length)];
  const laneOrder = [0, 2, 4, 1, 3] as const;
  const laneIndex = laneOrder[(id + state.wave) % laneOrder.length];
  const lane = SYSTEM_TYPE_LANES[laneIndex];
  const tier = id % 11 === 0 ? "critical" : id % 5 === 0 ? "elite" : "standard";
  const tierSpeed = tier === "critical" ? 0.88 : tier === "elite" ? 0.94 : 1;
  return {
    errors: 0,
    id,
    kind,
    lane,
    speed: (0.022 + state.wave * 0.0023 + state.difficulty * 0.012 + seeded(id * 8.3) * 0.008) * tierSpeed,
    tier,
    typed: 0,
    word,
    // Spawn fully inside the battlefield so the word is readable immediately.
    x: 0.91 + seeded(id * 2.4) * 0.035,
  };
}

function spawnInterval(wave: number, difficulty: number) {
  return Math.max(760, 1850 - wave * 78 - difficulty * 360);
}

export function advanceSystemType(
  state: SystemTypeState,
  deltaMs: number,
): SystemTypeState {
  const step = Math.min(deltaMs, 80);
  if (state.phase === "scanning") {
    const scanElapsed = state.scanElapsed + step;
    return scanElapsed >= SYSTEM_TYPE_SCAN_DURATION
      ? { ...state, nextSpawnAt: 520, phase: "running", scanElapsed: SYSTEM_TYPE_SCAN_DURATION }
      : { ...state, scanElapsed };
  }
  if (state.phase !== "running") return state;

  const deltaSeconds = step / 1000;
  const elapsed = state.elapsed + step;
  const wave = Math.min(12, Math.floor(elapsed / 18000) + 1);
  const performanceTarget = elapsed < 5000 ? 0 : clamp(
    Math.max(0, calculateWpm(state) - 24) / 90 * 0.48
      + Math.max(0, state.accuracy - 82) / 18 * 0.32
      + Math.min(state.combo, 18) / 18 * 0.2,
    0,
    1,
  );
  const difficulty = state.difficulty + (performanceTarget - state.difficulty) * Math.min(1, step / 2600);
  let lastId = state.lastId;
  let nextSpawnAt = state.nextSpawnAt;
  let threats = state.threats.map((threat) => ({
    ...threat,
    x: threat.x - threat.speed * deltaSeconds,
  }));

  if (elapsed >= nextSpawnAt) {
    const spawned = createThreat({ ...state, difficulty, elapsed, lastId, wave });
    threats = [...threats, spawned];
    lastId = spawned.id;
    nextSpawnAt = elapsed + spawnInterval(wave, difficulty);
  }

  const impacts = threats.filter((threat) => threat.x <= IMPACT_X);
  const impactedIds = new Set(impacts.map((threat) => threat.id));
  threats = threats.filter((threat) => !impactedIds.has(threat.id));
  const integrityLoss = impacts.reduce((total, threat) => (
    total + (threat.tier === "critical" ? 30 : threat.tier === "elite" ? 22 : 16)
  ), 0);
  const health = clamp(state.health - integrityLoss, 0, 100);
  const targetId = impactedIds.has(state.targetId ?? -1) ? null : state.targetId;
  const impactBursts: SystemTypeBurst[] = impacts.map((threat, index) => ({
    age: 0,
    id: lastId + index + 1,
    tone: "error",
    x: IMPACT_X,
    y: threat.lane,
  }));
  lastId += impactBursts.length;

  const shots = state.shots
    .map((shot) => ({ ...shot, age: shot.age + step }))
    .filter((shot) => shot.age < 230);
  const bursts = [...state.bursts, ...impactBursts]
    .map((burst) => ({ ...burst, age: burst.age + step }))
    .filter((burst) => burst.age < 520);
  const phase = health <= 0 ? "gameover" : "running";
  const highScore = Math.max(state.highScore, state.score);
  const feedback = impacts.length ? {
    at: elapsed,
    id: (state.feedback?.id ?? 0) + 1,
    text: health <= 25 ? "PRODUCTION FAILURE RISK" : "INTEGRITY BREACH",
    tone: health <= 25 ? "danger" as const : "warning" as const,
  } : state.feedback;

  return {
    ...state,
    bursts,
    combo: impacts.length ? 0 : state.combo,
    difficulty,
    elapsed,
    feedback,
    health,
    highScore,
    impacts: state.impacts + impacts.length,
    lastId,
    nextSpawnAt,
    phase,
    shots,
    targetId,
    threats,
    wave,
  };
}

function selectTarget(state: SystemTypeState, key: string) {
  if (state.targetId !== null) {
    return state.threats.find((threat) => threat.id === state.targetId) ?? null;
  }
  return [...state.threats]
    .filter((threat) => threat.word[0] === key)
    .sort((a, b) => a.x - b.x)[0] ?? null;
}

export function typeSystemKey(state: SystemTypeState, rawKey: string): SystemTypeState {
  if (state.phase !== "running") return state;
  const key = rawKey.toLowerCase();
  if (!/^[a-z]$/.test(key)) return state;

  const totalKeys = state.totalKeys + 1;
  const target = selectTarget(state, key);
  const expected = target?.word[target.typed];
  if (!target || expected !== key) {
    const feedback = state.combo >= 3 ? {
      at: state.elapsed,
      id: (state.feedback?.id ?? 0) + 1,
      text: "ALMOST… RECOVERY WINDOW",
      tone: "warning" as const,
    } : state.feedback;
    return {
      ...state,
      accuracy: calculateAccuracy(state.correctKeys, totalKeys),
      combo: 0,
      feedback,
      mistakes: state.mistakes + 1,
      threats: target
        ? state.threats.map((threat) => threat.id === target.id ? { ...threat, errors: threat.errors + 1 } : threat)
        : state.threats,
      totalKeys,
    };
  }

  const typed = target.typed + 1;
  const completed = typed >= target.word.length;
  const id = state.lastId + 1;
  const shot: SystemTypeShot = {
    age: 0,
    id,
    targetX: target.x,
    targetY: target.lane,
  };
  const threats = completed
    ? state.threats.filter((threat) => threat.id !== target.id)
    : state.threats.map((threat) => threat.id === target.id ? { ...threat, typed } : threat);
  const burst: SystemTypeBurst | null = completed ? {
    age: 0,
    id: id + 1,
    tone: "success",
    x: target.x,
    y: target.lane,
  } : null;
  const combo = completed ? state.combo + 1 : state.combo;
  const scoreGain = 10 + (completed ? target.word.length * 42 + combo * 18 : 0);
  const correctKeys = state.correctKeys + 1;
  const eliminated = state.eliminated + Number(completed);
  const perfect = completed && target.errors === 0;
  const nearMiss = completed && target.x <= IMPACT_X + 0.11;
  const feedback = completed ? {
    at: state.elapsed,
    id: (state.feedback?.id ?? 0) + 1,
    text: nearMiss
      ? "CRITICAL DEFENSE"
      : combo > 0 && combo % 10 === 0
        ? `CHAIN x${combo}`
        : perfect ? "PERFECT PATCH" : "SERVICE RESTORED",
    tone: nearMiss ? "critical" as const : perfect ? "perfect" as const : "success" as const,
  } : state.feedback;
  const score = state.score + scoreGain;
  const phase = eliminated >= SYSTEM_TYPE_OBJECTIVE ? "victory" : state.phase;

  return {
    ...state,
    accuracy: calculateAccuracy(correctKeys, totalKeys),
    bursts: burst ? [...state.bursts, burst] : state.bursts,
    combo,
    correctKeys,
    eliminated,
    feedback,
    highScore: Math.max(state.highScore, score),
    highestCombo: Math.max(state.highestCombo, combo),
    lastId: id + Number(Boolean(burst)),
    perfectKills: state.perfectKills + Number(perfect),
    phase,
    refactorCharge: completed ? clamp(state.refactorCharge + 13, 0, 100) : state.refactorCharge,
    score,
    shots: [...state.shots, shot],
    targetId: completed ? null : target.id,
    threats,
    totalKeys,
  };
}

export function activateSystemRefactor(state: SystemTypeState): SystemTypeState {
  if (state.phase !== "running" || state.refactorCharge < 100) return state;
  const bursts = state.threats.map((threat, index) => ({
    age: 0,
    id: state.lastId + index + 1,
    tone: "success" as const,
    x: threat.x,
    y: threat.lane,
  }));
  const eliminated = state.eliminated + state.threats.length;
  const score = state.score + state.threats.length * 180;
  return {
    ...state,
    bursts: [...state.bursts, ...bursts],
    eliminated,
    feedback: {
      at: state.elapsed,
      id: (state.feedback?.id ?? 0) + 1,
      text: "CODE REFACTOR DEPLOYED",
      tone: "critical",
    },
    health: clamp(state.health + 12, 0, 100),
    highScore: Math.max(state.highScore, score),
    lastId: state.lastId + bursts.length,
    phase: eliminated >= SYSTEM_TYPE_OBJECTIVE ? "victory" : state.phase,
    refactorCharge: 0,
    score,
    targetId: null,
    threats: [],
  };
}

export function systemTypeWpm(state: SystemTypeState) {
  return calculateWpm(state);
}

export function systemTypeRank(eliminated: number) {
  if (eliminated >= 20) return "Chief Architect";
  if (eliminated >= 15) return "Production Guardian";
  if (eliminated >= 10) return "Senior Engineer";
  if (eliminated >= 5) return "Engineer";
  return "Operator";
}

export function systemTypeScanMessage(scanElapsed: number) {
  if (scanElapsed < 700) return "> scanning production line...";
  if (scanElapsed < 1550) return "> detecting anomalies...";
  return "> threat signature found";
}

export function shooterPosition() {
  return SHOOTER_POSITION;
}
