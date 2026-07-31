import { BUG_HUNTER_LEVELS, WEAPON_DEFINITIONS } from "./bug-hunter.data";
import {
  BugHunterEngineerSprite,
  BugHunterEquipmentSprite,
} from "./bug-hunter-sprite";
import type {
  BugHunterState,
  BugHunterWeapon,
} from "./bug-hunter.types";

const WEAPONS: BugHunterWeapon[] = ["debugger", "unit-test", "hotfix", "patch"];

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.ceil(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function Meter({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "cyan" | "green" | "red";
  value: number;
}) {
  return (
    <div className="bug-hunter-meter" data-tone={tone}>
      <span><strong>{label}</strong><i>{Math.round(value)}%</i></span>
      <b><i style={{ width: `${value}%` }} /></b>
    </div>
  );
}

type BugHunterHudProps = {
  game: BugHunterState;
  onActivateRefactor: () => void;
  onPause: () => void;
  onSelectWeapon: (weapon: BugHunterWeapon) => void;
  onUseItem: (item: "coffee" | "energy-cell" | "repair-kit") => void;
};

export function BugHunterHud({
  game,
  onActivateRefactor,
  onPause,
  onSelectWeapon,
  onUseItem,
}: BugHunterHudProps) {
  const level = BUG_HUNTER_LEVELS[game.levelIndex];
  const repairedNodes = game.nodes.filter((node) => !node.isFaulted).length;

  return (
    <>
      <header className="bug-hunter-topbar">
        <div className="bug-hunter-topbar__identity">
          <span>BUG HUNTER</span>
          <strong>{level.code}</strong>
        </div>
        <dl>
          <div>
            <dt>System health</dt>
            <dd data-state={game.uptime < 35 ? "critical" : undefined}>
              {Math.round(game.uptime)}%
            </dd>
          </div>
          <div><dt>Uptime</dt><dd>{game.uptime.toFixed(1)}%</dd></div>
          <div><dt>Shift</dt><dd>{formatTimer(game.remaining)}</dd></div>
          <div><dt>Active bugs</dt><dd>{String(game.enemies.length).padStart(2, "0")}</dd></div>
          <div><dt>Score</dt><dd>{game.score.toLocaleString()}</dd></div>
        </dl>
        <button onClick={onPause} type="button">P // PAUSE</button>
      </header>

      <aside className="bug-hunter-player-panel">
        <div className="bug-hunter-player-panel__portrait">
          <BugHunterEngineerSprite frame="down" portrait />
          <span>LVL {String(game.player.level).padStart(2, "0")}</span>
        </div>
        <div>
          <p>SOFTWARE ENGINEER</p>
          <h3>On-call Operator</h3>
          <Meter label="HEALTH" tone="red" value={game.player.health} />
          <Meter label="ENERGY" tone="cyan" value={game.player.energy} />
          <Meter
            label="EXPERIENCE"
            tone="green"
            value={(game.player.xp / game.player.xpTarget) * 100}
          />
        </div>
        <section>
          <span>ACTIVE EQUIPMENT</span>
          <strong>{WEAPON_DEFINITIONS[game.player.weapon].label}</strong>
          <small>
            {game.player.weapon === "debugger"
              ? "Unlimited debug packets"
              : game.player.weapon === "unit-test"
                ? `${game.inventory.ammo} validation rounds`
                : `${game.inventory.patches} deployment patches`}
          </small>
        </section>
        <button
          className="bug-hunter-refactor"
          disabled={game.refactorCharge < 100}
          onClick={onActivateRefactor}
          type="button"
        >
          <span>Q // CODE REFACTOR</span>
          <i><b style={{ width: `${game.refactorCharge}%` }} /></i>
          <strong>{Math.round(game.refactorCharge)}%</strong>
        </button>
      </aside>

      <aside className="bug-hunter-operations-panel">
        <section>
          <header><span>OBJECTIVES</span><i>{level.code}</i></header>
          <h3>{level.name}</h3>
          <p>{level.objective}</p>
          <ul>
            <li data-complete={repairedNodes === game.nodes.length || undefined}>
              <span>Restore {level.systemTarget}</span>
              <strong>{repairedNodes} / {game.nodes.length}</strong>
            </li>
            <li data-complete={game.kills >= 10 || undefined}>
              <span>Eliminate active defects</span>
              <strong>{Math.min(game.kills, 10)} / 10</strong>
            </li>
            <li data-complete={game.uptime >= 80 || undefined}>
              <span>Maintain uptime above 80%</span>
              <strong>{Math.round(game.uptime)}%</strong>
            </li>
          </ul>
        </section>

        <section className="bug-hunter-alert-feed" aria-live="polite">
          <header><span>INCIDENT FEED</span><i>{game.incidentCount} EVENTS</i></header>
          <ol>
            {game.alerts.map((alert) => (
              <li data-tone={alert.tone} key={alert.id}>
                <i />
                <span>{alert.message}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bug-hunter-system-list">
          <header><span>SERVICE STATUS</span><i>LIVE</i></header>
          {game.nodes.map((node) => (
            <div key={node.id}>
              <i data-state={node.isFaulted ? "error" : "healthy"} />
              <span>{node.label}</span>
              <strong>{Math.round(node.health)}%</strong>
            </div>
          ))}
        </section>
      </aside>

      <footer className="bug-hunter-actionbar">
        <div className="bug-hunter-weapons">
          {WEAPONS.map((weapon, index) => (
            <button
              aria-pressed={game.player.weapon === weapon}
              key={weapon}
              onClick={() => onSelectWeapon(weapon)}
              type="button"
            >
              <kbd>{index + 1}</kbd>
              <BugHunterEquipmentSprite kind={weapon} />
              <span>{WEAPON_DEFINITIONS[weapon].label}</span>
            </button>
          ))}
        </div>
        <div className="bug-hunter-inventory">
          <button onClick={() => onUseItem("coffee")} type="button">
            <BugHunterEquipmentSprite kind="coffee" />
            <span>Coffee</span><strong>×{game.inventory.coffee}</strong><kbd>C</kbd>
          </button>
          <button onClick={() => onUseItem("repair-kit")} type="button">
            <BugHunterEquipmentSprite kind="repair-kit" />
            <span>Repair kit</span><strong>×{game.inventory.repairKits}</strong><kbd>R</kbd>
          </button>
          <div>
            <BugHunterEquipmentSprite kind="ammo" />
            <span>Ammo</span><strong>×{game.inventory.ammo}</strong>
          </div>
          <div>
            <BugHunterEquipmentSprite kind="patch" />
            <span>Patches</span><strong>×{game.inventory.patches}</strong>
          </div>
          <button onClick={() => onUseItem("energy-cell")} type="button">
            <BugHunterEquipmentSprite kind="energy-cell" />
            <span>Energy cell</span><strong>×{game.inventory.energyCells}</strong>
          </button>
        </div>
      </footer>
    </>
  );
}
