"use client";

import { useState } from "react";
import { BUG_HUNTER_LEVELS } from "./bug-hunter.data";
import { BugHunterHud } from "./bug-hunter-hud";
import { BugHunterMenu } from "./bug-hunter-menu";
import { BugHunterWorld } from "./bug-hunter-world";
import { useBugHunter } from "./use-bug-hunter";

type BugHunterGameProps = {
  onBack: () => void;
  onClose: () => void;
};

export function BugHunterGame({ onBack, onClose }: BugHunterGameProps) {
  const { actions, game, hasSave } = useBugHunter();
  const [screen, setScreen] = useState<"game" | "menu">("menu");
  const level = BUG_HUNTER_LEVELS[game.levelIndex];

  function launch(levelIndex: number) {
    actions.newGame(levelIndex);
    setScreen("game");
  }

  function continueGame() {
    actions.continueGame();
    setScreen("game");
  }

  if (screen === "menu") {
    return (
      <BugHunterMenu
        hasSave={hasSave}
        onBack={onBack}
        onClose={onClose}
        onContinue={continueGame}
        onNewGame={launch}
      />
    );
  }

  return (
    <section
      aria-labelledby="bug-hunter-title"
      className="bug-hunter"
      data-critical={game.uptime < 30 || undefined}
    >
      <h2 className="sr-only" id="bug-hunter-title">Bug Hunter: System Failure</h2>
      <BugHunterWorld
        game={game}
        onFire={actions.fireAt}
        onSetInput={actions.setInput}
      />
      <BugHunterHud
        game={game}
        onActivateRefactor={actions.activateRefactor}
        onPause={actions.pause}
        onSelectWeapon={actions.selectWeapon}
        onUseItem={actions.useItem}
      />

      {game.phase === "paused" || game.phase === "won" || game.phase === "lost" ? (
        <div className="bug-hunter-status">
          <div>
            <span>
              {game.phase === "paused"
                ? "SIMULATION PAUSED"
                : game.phase === "won"
                  ? "SHIFT COMPLETE"
                  : "SYSTEM FAILURE"}
            </span>
            <h3>
              {game.phase === "paused"
                ? level.name
                : game.phase === "won"
                  ? "Production remained online."
                  : game.player.health <= 0
                    ? "Engineer process terminated."
                    : "Uptime threshold breached."}
            </h3>
            <dl>
              <div><dt>Score</dt><dd>{game.score.toLocaleString()}</dd></div>
              <div><dt>Repairs</dt><dd>{game.repairs}</dd></div>
              <div><dt>Bugs</dt><dd>{game.kills}</dd></div>
              <div><dt>Uptime</dt><dd>{game.uptime.toFixed(1)}%</dd></div>
            </dl>
            <div className="bug-hunter-status__actions">
              {game.phase === "paused" ? (
                <button autoFocus onClick={actions.pause} type="button">Resume shift</button>
              ) : (
                <button autoFocus onClick={actions.restart} type="button">Restart level</button>
              )}
              {game.phase === "won" && game.levelIndex < BUG_HUNTER_LEVELS.length - 1 ? (
                <button onClick={() => launch(game.levelIndex + 1)} type="button">
                  Deploy next layer
                </button>
              ) : null}
              <button onClick={() => setScreen("menu")} type="button">Main menu</button>
              <button onClick={onClose} type="button">Exit game</button>
            </div>
          </div>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {game.phase}. System uptime {Math.round(game.uptime)} percent. {game.enemies.length} active
        bugs. {Math.ceil(game.remaining)} seconds remain.
      </p>
    </section>
  );
}
