"use client";

import type { CSSProperties, PointerEvent } from "react";
import { ENEMY_DEFINITIONS } from "./bug-hunter.data";
import {
  BugHunterEnemySprite,
  BugHunterEngineerSprite,
  BugHunterEquipmentSprite,
} from "./bug-hunter-sprite";
import type {
  BugHunterInput,
  BugHunterState,
  Point,
} from "./bug-hunter.types";

type BugHunterWorldProps = {
  game: BugHunterState;
  onFire: (target: Point) => void;
  onSetInput: (key: keyof BugHunterInput, active: boolean) => void;
};

function positioned(point: Point): CSSProperties {
  return { left: `${point.x}%`, top: `${point.y}%` };
}

export function BugHunterWorld({
  game,
  onFire,
  onSetInput,
}: BugHunterWorldProps) {
  function handleFire(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    onFire({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function movementButton(key: keyof BugHunterInput, label: string) {
    return (
      <button
        aria-label={label}
        onPointerCancel={() => onSetInput(key, false)}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          onSetInput(key, true);
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          onSetInput(key, false);
        }}
        type="button"
      >
        {label}
      </button>
    );
  }

  return (
    <div
      aria-label="Live production system map"
      className="bug-hunter-world"
      onPointerDown={handleFire}
      role="application"
    >
      <div aria-hidden="true" className="bug-hunter-world__map" />
      <div aria-hidden="true" className="bug-hunter-world__grid" />
      <div aria-hidden="true" className="bug-hunter-world__data-streams">
        <i /><i /><i />
      </div>

      {game.nodes.map((node) => (
        <div
          aria-label={`${node.label}: ${Math.round(node.health)} percent health`}
          className="bug-hunter-node"
          data-faulted={node.isFaulted || undefined}
          key={node.id}
          role="status"
          style={positioned(node)}
        >
          <i style={{ "--node-health": `${node.health}%` } as CSSProperties} />
          <span>{node.isFaulted ? "REPAIR // HOLD E" : node.label}</span>
        </div>
      ))}

      {game.projectiles.map((projectile) => (
        <span
          aria-hidden="true"
          className="bug-hunter-projectile"
          data-kind={projectile.kind}
          key={projectile.id}
          style={{
            ...positioned(projectile),
            "--projectile-radius": `${projectile.radius * 2}%`,
          } as CSSProperties}
        />
      ))}

      {game.pickups.map((pickup) => (
        <span
          aria-label={`${pickup.kind} pickup`}
          className="bug-hunter-pickup"
          key={pickup.id}
          role="img"
          style={positioned(pickup)}
        >
          <BugHunterEquipmentSprite kind={pickup.kind} />
        </span>
      ))}

      {game.enemies.map((enemy) => (
        <span
          aria-label={`${ENEMY_DEFINITIONS[enemy.kind].label}, ${Math.ceil(enemy.hp)} health`}
          className="bug-hunter-enemy"
          data-kind={enemy.kind}
          key={enemy.id}
          role="img"
          style={positioned(enemy)}
        >
          <BugHunterEnemySprite
            kind={enemy.kind}
            large={enemy.kind === "stack-overflow" || enemy.kind === "database-corruption"}
          />
          <i>
            <b style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }} />
          </i>
        </span>
      ))}

      <span
        aria-label={`Player at ${Math.round(game.player.x)}, ${Math.round(game.player.y)}`}
        className="bug-hunter-player"
        role="img"
        style={positioned(game.player)}
      >
        <BugHunterEngineerSprite frame={game.player.direction} />
        <i />
      </span>

      <div className="bug-hunter-touch-controls">
        <div className="bug-hunter-dpad">
          {movementButton("up", "↑")}
          {movementButton("left", "←")}
          {movementButton("down", "↓")}
          {movementButton("right", "→")}
        </div>
        <div className="bug-hunter-touch-actions">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onFire({ x: game.player.x + 12, y: game.player.y });
            }}
            type="button"
          >
            FIRE
          </button>
          <button
            onPointerCancel={() => onSetInput("repair", false)}
            onPointerDown={(event) => {
              event.stopPropagation();
              onSetInput("repair", true);
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
              onSetInput("repair", false);
            }}
            type="button"
          >
            REPAIR
          </button>
        </div>
      </div>

      {game.uptime < 30 ? <div aria-hidden="true" className="bug-hunter-critical" /> : null}
    </div>
  );
}

