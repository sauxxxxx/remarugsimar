import type { CSSProperties } from "react";
import type { BugHunterWeapon, EnemyKind, PickupKind } from "./bug-hunter.types";

type AtlasKind = "enemy" | "engineer" | "equipment";

const ATLAS_PATHS: Record<AtlasKind, string> = {
  enemy: "/games/bug-hunter/enemy-atlas.webp",
  engineer: "/games/bug-hunter/engineer-atlas.webp",
  equipment: "/games/bug-hunter/equipment-atlas.webp",
};

const ENEMY_FRAMES: Record<EnemyKind, [number, number]> = {
  "memory-leak": [0, 0],
  "null-reference": [1, 0],
  "infinite-loop": [2, 0],
  "race-condition": [3, 0],
  "stack-overflow": [0, 1],
  deadlock: [1, 1],
  "database-corruption": [2, 1],
};

const EQUIPMENT_FRAMES: Record<BugHunterWeapon | PickupKind, [number, number]> = {
  debugger: [0, 0],
  "unit-test": [1, 0],
  hotfix: [2, 0],
  patch: [3, 0],
  coffee: [0, 1],
  "repair-kit": [1, 1],
  ammo: [2, 1],
  "energy-cell": [2, 1],
};

const ENGINEER_FRAMES = {
  down: [0, 0],
  up: [1, 0],
  right: [2, 0],
  left: [0, 1],
  attack: [1, 1],
  repair: [2, 1],
  damaged: [3, 1],
} satisfies Record<string, [number, number]>;

function frameStyle(atlas: AtlasKind, frame: [number, number]): CSSProperties {
  return {
    backgroundImage: `url("${ATLAS_PATHS[atlas]}")`,
    backgroundPosition: `${frame[0] * 33.3333}% ${frame[1] * 100}%`,
    backgroundSize: "400% 200%",
  };
}

export function BugHunterEnemySprite({
  kind,
  large = false,
}: {
  kind: EnemyKind;
  large?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`bug-hunter-sprite bug-hunter-sprite--enemy${large ? " is-large" : ""}`}
      style={frameStyle("enemy", ENEMY_FRAMES[kind])}
    />
  );
}

export function BugHunterEngineerSprite({
  frame,
  portrait = false,
}: {
  frame: keyof typeof ENGINEER_FRAMES;
  portrait?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`bug-hunter-sprite bug-hunter-sprite--engineer${portrait ? " is-portrait" : ""}`}
      style={frameStyle("engineer", ENGINEER_FRAMES[frame])}
    />
  );
}

export function BugHunterEquipmentSprite({
  kind,
}: {
  kind: BugHunterWeapon | PickupKind;
}) {
  const frame = kind === "energy-cell" ? EQUIPMENT_FRAMES.ammo : EQUIPMENT_FRAMES[kind];
  return (
    <span
      aria-hidden="true"
      className="bug-hunter-sprite bug-hunter-sprite--equipment"
      style={frameStyle("equipment", frame)}
    />
  );
}
