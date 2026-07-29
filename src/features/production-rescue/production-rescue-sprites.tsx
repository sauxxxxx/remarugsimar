import type { CSSProperties } from "react";
import type {
  Direction,
  RescueActionAnimation,
  RescueBug,
  RescueState,
  RescueSystem,
} from "./production-rescue.types";

const PASS_TWO_ROOT = "/games/production-rescue/sprites/pass-2";
const PASS_ONE_ROOT = "/games/production-rescue/sprites";

type SpriteSheet = {
  columns: number;
  frameAspect: number;
  rows: number;
  src: string;
};

type SpriteStyle = CSSProperties & {
  "--rescue-sprite-row": string;
};

type SpriteSequenceProps = {
  className: string;
  column?: number;
  duration?: number;
  frames: number;
  loop?: boolean;
  playing?: boolean;
  row: number;
  sheet: SpriteSheet;
};

const SHEETS = {
  bugAttack: {
    columns: 6,
    frameAspect: 1,
    rows: 4,
    src: `${PASS_TWO_ROOT}/bug-attack-directional.png`,
  },
  bugLocomotion: {
    columns: 6,
    frameAspect: 1,
    rows: 4,
    src: `${PASS_TWO_ROOT}/bug-locomotion-directional.png`,
  },
  door: {
    columns: 8,
    frameAspect: 0.5,
    rows: 2,
    src: `${PASS_TWO_ROOT}/door-8f.png`,
  },
  equipmentFailure: {
    columns: 6,
    frameAspect: 296 / 222,
    rows: 4,
    src: `${PASS_TWO_ROOT}/equipment-failure-sequences.png`,
  },
  impact: {
    columns: 6,
    frameAspect: 284 / 230,
    rows: 4,
    src: `${PASS_TWO_ROOT}/impact-effects.png`,
  },
  items: {
    columns: 4,
    frameAspect: 1,
    rows: 3,
    src: `${PASS_ONE_ROOT}/items.png`,
  },
  playerGun: {
    columns: 6,
    frameAspect: 286 / 229,
    rows: 4,
    src: `${PASS_TWO_ROOT}/technician-gun-directional.png`,
  },
  playerInteractions: {
    columns: 6,
    frameAspect: 270 / 243,
    rows: 4,
    src: `${PASS_TWO_ROOT}/technician-interactions.png`,
  },
  playerLocomotion: {
    columns: 8,
    frameAspect: 1,
    rows: 4,
    src: `${PASS_TWO_ROOT}/technician-locomotion-8f.png`,
  },
  playerRepair: {
    columns: 6,
    frameAspect: 286 / 229,
    rows: 4,
    src: `${PASS_TWO_ROOT}/technician-repair-directional.png`,
  },
  playerWrench: {
    columns: 6,
    frameAspect: 1,
    rows: 4,
    src: `${PASS_TWO_ROOT}/technician-wrench-directional.png`,
  },
} satisfies Record<string, SpriteSheet>;

const DIRECTION_ROW: Record<Direction, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

function rowPosition(row: number, rows: number) {
  return rows <= 1 ? 0 : (row / (rows - 1)) * 100;
}

function columnPosition(column: number, columns: number) {
  return columns <= 1 ? 0 : (column / (columns - 1)) * 100;
}

export function SpriteSequence({
  className,
  column = 0,
  duration = 650,
  frames,
  loop = false,
  playing = true,
  row,
  sheet,
}: SpriteSequenceProps) {
  const rowPercent = rowPosition(row, sheet.rows);
  const style: SpriteStyle = {
    "--rescue-sprite-row": `${rowPercent}%`,
    animationDuration: `${duration}ms`,
    animationIterationCount: loop ? "infinite" : "1",
    animationTimingFunction: `steps(${Math.max(1, frames - 1)})`,
    aspectRatio: String(sheet.frameAspect),
    backgroundImage: `url("${sheet.src}")`,
    backgroundPosition: `${columnPosition(column, sheet.columns)}% ${rowPercent}%`,
    backgroundSize: `${sheet.columns * 100}% ${sheet.rows * 100}%`,
  };

  return (
    <span
      aria-hidden="true"
      className={`rescue-sprite ${className}`}
      data-playing={playing || undefined}
      style={style}
    />
  );
}

function interactionRow(
  game: RescueState,
  nearCoffee: boolean,
  nearDoor: boolean,
) {
  if (nearDoor) return 0;
  if (nearCoffee) return 1;
  if (game.activeTool === "ammo") return 2;
  if (game.activeTool === "coffee") return 3;
  return game.activeTool === "wrench" ? -1 : 0;
}

export function PlayerSprite({
  action,
  game,
  moving,
  nearCoffee,
  nearDoor,
}: {
  action: RescueActionAnimation | null;
  game: RescueState;
  moving: boolean;
  nearCoffee: boolean;
  nearDoor: boolean;
}) {
  const directionRow = DIRECTION_ROW[game.player.facing];
  if (game.repairJob) {
    return <SpriteSequence className="rescue-player-sprite rescue-player-sprite--wide" duration={760} frames={6} loop row={directionRow} sheet={SHEETS.playerRepair} />;
  }
  if (action === "gun") {
    return <SpriteSequence className="rescue-player-sprite rescue-player-sprite--wide" duration={520} frames={6} row={directionRow} sheet={SHEETS.playerGun} />;
  }
  if (action === "wrench") {
    return <SpriteSequence className="rescue-player-sprite" duration={620} frames={6} row={directionRow} sheet={SHEETS.playerWrench} />;
  }
  if (action === "interact") {
    const row = interactionRow(game, nearCoffee, nearDoor);
    if (row < 0) {
      return <SpriteSequence className="rescue-player-sprite" duration={620} frames={6} row={directionRow} sheet={SHEETS.playerWrench} />;
    }
    return <SpriteSequence className="rescue-player-sprite rescue-player-sprite--interaction" duration={680} frames={6} row={row} sheet={SHEETS.playerInteractions} />;
  }
  return (
    <SpriteSequence
      className="rescue-player-sprite"
      duration={640}
      frames={8}
      loop
      playing={moving}
      row={directionRow}
      sheet={SHEETS.playerLocomotion}
    />
  );
}

function directionBetween(
  from: { x: number; y: number },
  to: { x: number; y: number } | undefined,
): Direction {
  if (!to) return "down";
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  if (Math.abs(deltaX) > Math.abs(deltaY)) return deltaX < 0 ? "left" : "right";
  return deltaY < 0 ? "up" : "down";
}

export function BugSprite({
  bug,
  target,
}: {
  bug: RescueBug;
  target: { x: number; y: number } | undefined;
}) {
  const waypoint = bug.path[bug.pathIndex];
  const attacking = !waypoint;
  const row = DIRECTION_ROW[directionBetween(bug, waypoint ?? target)];
  return (
    <SpriteSequence
      className="rescue-bug-sprite"
      duration={attacking ? 720 : 620}
      frames={6}
      loop
      row={row}
      sheet={attacking ? SHEETS.bugAttack : SHEETS.bugLocomotion}
    />
  );
}

export function DoorSprite({ open }: { open: boolean }) {
  return (
    <SpriteSequence
      className="rescue-door-sprite"
      duration={720}
      frames={8}
      row={open ? 0 : 1}
      sheet={SHEETS.door}
    />
  );
}

function systemRow(system: RescueSystem) {
  if (system.id.startsWith("rack")) return 0;
  if (system.id.startsWith("desk")) return 1;
  return 2;
}

export function SystemFailureSprite({ system }: { system: RescueSystem }) {
  if (system.health === "healthy") return null;
  return (
    <SpriteSequence
      className="rescue-system-failure-sprite"
      duration={system.health === "critical" ? 680 : 980}
      frames={6}
      row={systemRow(system)}
      sheet={SHEETS.equipmentFailure}
    />
  );
}

export function ProjectileSprite() {
  return <SpriteSequence className="rescue-projectile-sprite" duration={360} frames={6} loop row={0} sheet={SHEETS.impact} />;
}

export function AmmoPickupSprite() {
  return <SpriteSequence className="rescue-ammo-sprite" column={2} frames={1} playing={false} row={2} sheet={SHEETS.items} />;
}
