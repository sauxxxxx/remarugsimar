"use client";

import { SystemTypeCanvas } from "./system-type-canvas";
import { SystemTypeHud } from "./system-type-hud";
import {
  SystemTypeFeedback,
  SystemTypeInputPanel,
  SystemTypeObjective,
  SystemTypeStatePanel,
} from "./system-type-panels";
import { useSystemType } from "./use-system-type";

type SystemTypeGameProps = {
  onBack: () => void;
  onClose: () => void;
};

export function SystemTypeGame({ onBack, onClose }: SystemTypeGameProps) {
  const { actions, muted, state } = useSystemType();
  const intensity = state.health <= 25 ? "critical" : state.difficulty >= 0.65 ? "high" : state.difficulty >= 0.3 ? "rising" : "calm";

  return (
    <section aria-labelledby="system-type-title" className="system-type" data-intensity={intensity} data-phase={state.phase}>
      <SystemTypeHud state={state} />

      <div className="system-type-field">
        <SystemTypeCanvas state={state} />
        <div className="system-type-sector" aria-hidden="true">
          <span>{"// SECTOR .A7"}</span>
          <span>LAYER {String(state.wave).padStart(2, "0")}</span>
          <span>X: {(state.elapsed / 1000).toFixed(2)} &nbsp; Y: {(state.difficulty * 100).toFixed(2)}</span>
        </div>
        <SystemTypeInputPanel state={state} />
        <SystemTypeObjective state={state} />
        <SystemTypeFeedback state={state} />
        <SystemTypeStatePanel actions={actions} state={state} />
      </div>

      <footer className="system-type-footer">
        <div>
          <button onClick={onClose} type="button"><kbd>esc</kbd> close</button>
          <button onClick={actions.restart} type="button"><kbd>tab</kbd> restart</button>
          <button onClick={onBack} type="button">← game.list</button>
          <button aria-pressed={muted} onClick={actions.toggleMuted} type="button">{muted ? "sound off" : "sound on"}</button>
        </div>
        <button
          className="system-type-refactor"
          disabled={state.refactorCharge < 100 || state.phase !== "running"}
          onClick={actions.refactor}
          type="button"
        >
          <span><kbd>q</kbd> code refactor / {Math.round(state.refactorCharge)}%</span>
          <i><b style={{ width: `${state.refactorCharge}%` }} /></i>
        </button>
      </footer>

      <div className="system-type-mobile-note">
        <p>SYSTEM.TYPE requires a physical keyboard. Open this game on desktop to play.</p>
        <div>
          <button onClick={onBack} type="button">← game.list</button>
          <button onClick={onClose} type="button">close</button>
        </div>
      </div>
    </section>
  );
}
