"use client";

import { Coffee, Crosshair, PackageOpen, Wrench } from "lucide-react";
import type { RescueState, RescueTool } from "./production-rescue.types";

const EQUIPMENT = [
  { icon: Wrench, key: "1", label: "Wrench", tool: "wrench" },
  { icon: Coffee, key: "2", label: "Coffee", tool: "coffee" },
  { icon: Crosshair, key: "3", label: "Bug Gun", tool: "gun" },
  { icon: PackageOpen, key: "4", label: "Ammo Pack", tool: "ammo" },
] satisfies Array<{
  icon: typeof Wrench;
  key: string;
  label: string;
  tool: RescueTool;
}>;

type RescueHudProps = {
  game: RescueState;
  objective: string;
  onSelect: (tool: RescueTool) => void;
};

export function RescueTopHud({ game, objective }: Omit<RescueHudProps, "onSelect">) {
  return (
    <header className="rescue-hud">
      <div className="rescue-hud__identity">
        <span>data center / live shift</span>
        <strong>{objective}</strong>
      </div>
      <dl>
        <div><dt>uptime</dt><dd>{Math.round(game.uptime)}<small>%</small></dd></div>
        <div><dt>shift</dt><dd>{Math.ceil(game.timeLeft)}<small>s</small></dd></div>
        <div><dt>repairs</dt><dd>{game.repairs}</dd></div>
        <div><dt>bugs</dt><dd>{game.bugs.length}</dd></div>
        <div><dt>score</dt><dd>{game.score.toLocaleString()}</dd></div>
      </dl>
    </header>
  );
}

export function RescueInventory({ game, onSelect }: Omit<RescueHudProps, "objective">) {
  return (
    <div className="rescue-inventory">
      <div className="rescue-energy">
        <span><small>energy</small><strong>{Math.round(game.energy)}%</strong></span>
        <span className="rescue-energy__track">
          <span
            data-low={game.energy < 20 || undefined}
            style={{ width: `${game.energy}%` }}
          />
        </span>
      </div>

      <div aria-label="Work bag equipment" className="rescue-equipment" role="toolbar">
        {EQUIPMENT.map(({ icon: Icon, key, label, tool }) => {
          const count =
            tool === "coffee"
              ? game.coffee
              : tool === "gun"
                ? game.ammo
                : tool === "ammo"
                  ? game.ammoPacks
                  : null;
          return (
            <button
              aria-label={`${key}: ${label}${count === null ? "" : `, ${count} available`}`}
              aria-pressed={game.activeTool === tool}
              data-active={game.activeTool === tool || undefined}
              key={tool}
              onClick={() => onSelect(tool)}
              type="button"
            >
              <kbd>{key}</kbd>
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {count !== null ? <strong>{count}</strong> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
