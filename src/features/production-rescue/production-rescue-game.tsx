"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bug,
  Coffee,
  DoorClosed,
  DoorOpen,
  Flame,
  PackageOpen,
  Pause,
  ShieldCheck,
  Siren,
  Wrench,
} from "lucide-react";
import {
  COFFEE_STATION,
  INCIDENT_LABEL,
  PRODUCTION_RESCUE_COPY,
} from "./production-rescue.constants";
import { RescueInventory, RescueTopHud } from "./production-rescue-hud";
import type { IncidentKind, RescueSystem } from "./production-rescue.types";
import { useProductionRescue } from "./use-production-rescue";
import {
  isNearServerDoor,
  SERVER_DOOR,
  STATIC_OBSTACLES,
  WALKABLE_ZONES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  worldPosition,
  worldRect,
} from "./production-rescue-world";

type ProductionRescueGameProps = {
  onBack: () => void;
};

const INCIDENT_ICONS = {
  fire: Flame,
  hardware: Wrench,
  malware: Bug,
} satisfies Record<IncidentKind, typeof Wrench>;

function SystemMarker({
  onSelect,
  system,
}: {
  onSelect: () => void;
  system: RescueSystem;
}) {
  const incident = system.incident;
  const Icon = incident ? INCIDENT_ICONS[incident] : ShieldCheck;
  return (
    <button
      aria-label={`${system.label}: ${incident ? INCIDENT_LABEL[incident] : "healthy"}`}
      className="rescue-system-marker"
      data-health={system.health}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      style={worldPosition(system)}
      type="button"
    >
      <span className="rescue-system-marker__pulse" />
      {incident ? (
        <span className="rescue-system-marker__alert">
          <Icon aria-hidden="true" />
          <span>{INCIDENT_LABEL[incident]}</span>
        </span>
      ) : null}
    </button>
  );
}

function RescueStatus({
  onStart,
  score,
  status,
}: {
  onStart: () => void;
  score: number;
  status: "gameover" | "paused" | "ready" | "won";
}) {
  const content = {
    ready: {
      detail: "Repair equipment, manage energy, collect ammo, and eliminate Game Bugs.",
      label: PRODUCTION_RESCUE_COPY.start,
      title: "Data center shift ready",
    },
    paused: {
      detail: "The facility simulation is paused.",
      label: PRODUCTION_RESCUE_COPY.resume,
      title: "Shift paused",
    },
    won: {
      detail: `${score.toLocaleString()} points · uptime stayed above 70%`,
      label: PRODUCTION_RESCUE_COPY.restart,
      title: "Data center secured",
    },
    gameover: {
      detail: `${score.toLocaleString()} points · stabilize resources and try again`,
      label: PRODUCTION_RESCUE_COPY.restart,
      title: "Shift failed",
    },
  }[status];

  return (
    <div className="rescue-status">
      <span className="rescue-status__eyebrow">production rescue / technician shift</span>
      <strong>{content.title}</strong>
      <span>{content.detail}</span>
      {status === "ready" ? (
        <ul>
          <li><Wrench aria-hidden="true" /> click failed equipment to auto-walk and repair</li>
          <li><Coffee aria-hidden="true" /> collect coffee and protect your energy</li>
          <li><Siren aria-hidden="true" /> use the Bug Gun or wrench against infestations</li>
        </ul>
      ) : null}
      <button autoFocus onClick={onStart} type="button">
        {content.label}
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

function CollisionMap({ doorOpen }: { doorOpen: boolean }) {
  return (
    <div aria-hidden="true" className="rescue-collision-map">
      {WALKABLE_ZONES.map((zone) => (
        <span className="rescue-collision-map__walkable" key={zone.id} style={worldRect(zone)} />
      ))}
      {doorOpen ? (
        <span className="rescue-collision-map__walkable" style={worldRect(SERVER_DOOR.passage)} />
      ) : null}
      {STATIC_OBSTACLES.map((obstacle) => (
        <span
          className="rescue-collision-map__obstacle"
          key={obstacle.id}
          style={worldRect(obstacle)}
        />
      ))}
    </div>
  );
}

export function ProductionRescueGame({ onBack }: ProductionRescueGameProps) {
  const { actions, animation, game, highScore } = useProductionRescue();
  const inactiveStatus = game.status === "playing" ? null : game.status;
  const activeIncident = game.systems.find((system) => system.health !== "healthy");
  const objective = game.energy < 20
    ? "Energy critical · select coffee with 2"
    : activeIncident
      ? `${activeIncident.label}: ${activeIncident.incident ? INCIDENT_LABEL[activeIncident.incident] : "failure"}${
          activeIncident.id.startsWith("rack") && !game.doorOpen ? " · open server door first" : ""
        }`
      : game.bugs.length
        ? `${game.bugs.length} active Game Bug${game.bugs.length === 1 ? "" : "s"}`
        : "All systems stable · monitor the floor";
  const nearDoor = isNearServerDoor(game.player);
  const DoorIcon = game.doorOpen ? DoorOpen : DoorClosed;

  function handleWorldClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    actions.worldClick({
      x: ((event.clientX - rect.left) / rect.width) * WORLD_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * WORLD_HEIGHT,
    });
  }

  return (
    <section aria-labelledby="production-rescue-title" className="production-rescue">
      <h2 className="sr-only" id="production-rescue-title">Production Rescue</h2>

      <button className="game-back-control" onClick={onBack} type="button">
        <span aria-hidden="true">←</span>
        game.list
      </button>

      <RescueTopHud game={game} objective={objective} />

      <div className="rescue-stage">
        <div
          aria-label={`Data center floor. ${Math.round(game.uptime)} percent uptime and ${Math.ceil(game.timeLeft)} seconds left.`}
          className="rescue-world"
          onClick={handleWorldClick}
          role="group"
        >
          <Image
            alt=""
            className="rescue-world__background"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 960px"
            src="/games/production-rescue/operations-office.png"
          />

          {animation.showCollisionMap ? <CollisionMap doorOpen={game.doorOpen} /> : null}

          <span
            aria-label={`Server-room door ${game.doorOpen ? "open" : "closed"}`}
            className="rescue-server-door"
            data-nearby={nearDoor || undefined}
            data-open={game.doorOpen || undefined}
            style={worldRect(SERVER_DOOR.passage)}
          >
            <span className="rescue-server-door__panel" />
            <span aria-hidden={!nearDoor} className="rescue-server-door__prompt">
              <DoorIcon aria-hidden="true" />
              <span><kbd>E</kbd> {game.doorOpen ? "close door" : "open door"}</span>
            </span>
          </span>

          {game.systems.map((system) => (
            <SystemMarker
              key={system.id}
              onSelect={() => actions.chooseSystem(system.id)}
              system={system}
            />
          ))}

          <button
            aria-label="Collect coffee from coffee machine"
            className="rescue-coffee-station"
            onClick={(event) => {
              event.stopPropagation();
              actions.chooseCoffee();
            }}
            style={worldPosition(COFFEE_STATION)}
            type="button"
          >
            <Coffee aria-hidden="true" />
            <span>coffee machine</span>
          </button>

          {game.pickups.map((pickup) => (
            <span
              aria-label="Ammo pack pickup"
              className="rescue-ammo-pickup"
              key={pickup.id}
              style={worldPosition(pickup)}
            >
              <PackageOpen aria-hidden="true" />
            </span>
          ))}

          {game.bugs.map((bug) => (
            <button
              aria-label={`Game Bug, ${bug.health} health`}
              className="rescue-bug"
              key={bug.id}
              onClick={(event) => {
                event.stopPropagation();
                actions.chooseBug(bug.id);
              }}
              style={worldPosition(bug)}
              type="button"
            >
              <Image alt="" height={128} src="/games/production-rescue/software-bug.png" width={128} />
              <span className="rescue-bug__health">
                <span style={{ width: `${(bug.health / 3) * 100}%` }} />
              </span>
            </button>
          ))}

          {game.projectiles.map((projectile) => (
            <span
              aria-hidden="true"
              className="rescue-projectile"
              key={projectile.id}
              style={worldPosition(projectile)}
            />
          ))}

          <span
            aria-label="Remar, data center technician"
            className="rescue-player"
            data-acting={Boolean(game.repairJob) || animation.isActing || undefined}
            data-facing={game.player.facing}
            data-moving={animation.isMoving || game.navigation.length > 0 || undefined}
            style={worldPosition(game.player)}
          >
            <Image
              alt=""
              height={180}
              priority
              src="/games/production-rescue/developer.png"
              width={180}
            />
            <span className="rescue-player__shadow" />
            {game.repairJob ? (
              <span className="rescue-repair-progress">
                <span style={{ width: `${game.repairJob.progress}%` }} />
              </span>
            ) : null}
          </span>

          <div className="rescue-feed" aria-live="polite">
            <span>facility notification</span>
            <p>{game.message}</p>
          </div>

          {inactiveStatus ? (
            <RescueStatus
              onStart={inactiveStatus === "paused" ? actions.pause : actions.start}
              score={game.score}
              status={inactiveStatus}
            />
          ) : null}
        </div>
      </div>

      <RescueInventory game={game} onSelect={actions.select} />

      <div aria-label="Touch game controls" className="rescue-touch">
        <button aria-label="Move left" onClick={() => actions.move("left")} type="button"><ArrowLeft /></button>
        <button aria-label="Move up" onClick={() => actions.move("up")} type="button"><ArrowUp /></button>
        <button aria-label="Move down" onClick={() => actions.move("down")} type="button"><ArrowDown /></button>
        <button aria-label="Move right" onClick={() => actions.move("right")} type="button"><ArrowRight /></button>
        <button aria-label="Interact" className="rescue-touch__action" onClick={actions.action} type="button"><Wrench /><span>action</span></button>
        <button aria-label="Pause or resume" onClick={actions.pause} type="button"><Pause /></button>
      </div>

      <p aria-live="polite" className="sr-only">
        {game.status}. {Math.round(game.uptime)} percent uptime. {Math.round(game.energy)} percent energy.
        {game.bugs.length} active bugs. {Math.ceil(game.timeLeft)} seconds remaining.
      </p>

      <footer className="rescue-shortcuts">
        <span><kbd>WASD</kbd> move</span>
        <span><kbd>click</kbd> move / use equipment</span>
        <span><kbd>E</kbd> interact</span>
        <span><kbd>1—4</kbd> equipment</span>
        <button onClick={actions.toggleCollisionMap} type="button"><kbd>G</kbd> collision map</button>
        <span>best {highScore.toLocaleString()}</span>
      </footer>
    </section>
  );
}
